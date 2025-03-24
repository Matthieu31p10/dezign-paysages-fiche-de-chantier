import { useState } from 'react';
import { ProjectInfo, Team } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Building2, Home, Landmark } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectFormProps {
  initialData?: ProjectInfo;
  onSuccess?: () => void;
}

const ProjectForm = ({ initialData, onSuccess }: ProjectFormProps) => {
  const navigate = useNavigate();
  const { addProjectInfo, updateProjectInfo, teams, addTeam } = useApp();
  const [newTeamName, setNewTeamName] = useState('');
  const [showNewTeamInput, setShowNewTeamInput] = useState(false);
  
  const [formData, setFormData] = useState<Omit<ProjectInfo, 'id' | 'createdAt'>>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    contact: {
      phone: initialData?.contact.phone || '',
      email: initialData?.contact.email || '',
    },
    contract: {
      details: initialData?.contract.details || '',
      documentUrl: initialData?.contract.documentUrl || '',
    },
    annualVisits: initialData?.annualVisits || 0,
    annualTotalHours: initialData?.annualTotalHours || 0,
    visitDuration: initialData?.visitDuration || 0,
    additionalInfo: initialData?.additionalInfo || '',
    team: initialData?.team || (teams.length > 0 ? teams[0].id : ''),
    projectType: initialData?.projectType || '',
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    isArchived: initialData?.isArchived || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleTeamChange = (value: string) => {
    if (value === 'new') {
      setShowNewTeamInput(true);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      team: value,
    }));
  };

  const handleAddNewTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Veuillez saisir un nom d\'équipe');
      return;
    }
    
    const newTeam = addTeam({ name: newTeamName.trim() });
    setFormData((prev) => ({
      ...prev,
      team: newTeam.id,
    }));
    
    setNewTeamName('');
    setShowNewTeamInput(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const documentUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          contract: {
            ...prev.contract,
            documentUrl,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectTypeChange = (value: 'residence' | 'particular' | 'enterprise' | '') => {
    setFormData(prev => ({
      ...prev,
      projectType: value
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date,
      ...((field === 'endDate' && date) ? { isArchived: true } : {})
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'PPP', { locale: fr });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom du chantier est requis');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('L\'adresse du chantier est requise');
      return;
    }
    
    if (!formData.team) {
      toast.error('Veuillez sélectionner une équipe');
      return;
    }
    
    if (initialData) {
      updateProjectInfo({ ...formData, id: initialData.id, createdAt: initialData.createdAt });
    } else {
      addProjectInfo(formData);
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/projects');
    }
  };

  const getProjectTypeIcon = () => {
    switch (formData.projectType) {
      case 'residence':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'particular':
        return <Home className="h-4 w-4 text-blue-400" />;
      case 'enterprise':
        return <Landmark className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium">
            {initialData ? 'Modifier la fiche chantier' : 'Nouvelle fiche chantier'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du chantier</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nom du chantier"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse du chantier</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse complète"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Type de chantier</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleProjectTypeChange(value as 'residence' | 'particular' | 'enterprise' | '')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un type">
                      {formData.projectType && (
                        <div className="flex items-center gap-2">
                          {getProjectTypeIcon()}
                          <span>
                            {formData.projectType === 'residence' && 'Résidence'}
                            {formData.projectType === 'particular' && 'Particulier'}
                            {formData.projectType === 'enterprise' && 'Entreprise'}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residence" className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-green-500" />
                        <span>Résidence</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="particular">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-400" />
                        <span>Particulier</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-orange-500" />
                        <span>Entreprise</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          formatDate(formData.startDate)
                        ) : (
                          <span>Sélectionner</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                        onSelect={(date) => handleDateChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          formatDate(formData.endDate)
                        ) : (
                          <span>Sélectionner</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                        onSelect={(date) => handleDateChange('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact.phone">Téléphone de contact</Label>
                <Input
                  id="contact.phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact.email">Email de contact</Label>
                <Input
                  id="contact.email"
                  name="contact.email"
                  type="email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Équipe responsable</Label>
                {showNewTeamInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Nom de la nouvelle équipe"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddNewTeam}
                      size="sm"
                    >
                      Ajouter
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowNewTeamInput(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.team}
                    onValueChange={handleTeamChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Nouvelle équipe</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract.details">Informations du contrat</Label>
                <Textarea
                  id="contract.details"
                  name="contract.details"
                  value={formData.contract.details}
                  onChange={handleInputChange}
                  placeholder="Détails du contrat"
                  rows={4}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractDocument">Document de contrat (PDF)</Label>
                <Input
                  id="contractDocument"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.contract.documentUrl && (
                  <p className="text-sm text-green-600 mt-1">
                    Document chargé avec succès
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualVisits">Passages annuels</Label>
                  <Input
                    id="annualVisits"
                    name="annualVisits"
                    type="number"
                    min="0"
                    value={formData.annualVisits}
                    onChange={handleNumberChange}
                    placeholder="Nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualTotalHours">Heures annuelles</Label>
                  <Input
                    id="annualTotalHours"
                    name="annualTotalHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.annualTotalHours}
                    onChange={handleNumberChange}
                    placeholder="Heures"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitDuration">Durée par passage</Label>
                  <Input
                    id="visitDuration"
                    name="visitDuration"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.visitDuration}
                    onChange={handleNumberChange}
                    placeholder="Heures"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informations complémentaires</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Remarques supplémentaires"
                  rows={4}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Créer la fiche'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProjectForm;
