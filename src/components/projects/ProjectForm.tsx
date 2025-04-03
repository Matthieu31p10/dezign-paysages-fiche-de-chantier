import { useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { TeamsSelect } from '@/components/teams/TeamsSelect';

interface ProjectFormProps {
  initialData?: ProjectInfo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Helper function to safely convert to a ProjectInfo object
 */
const convertToProjectInfo = (data: any): Partial<ProjectInfo> => {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    contact: data.contact,
    contract: data.contract,
    irrigation: data.irrigation,
    mowerType: data.mowerType,
    annualVisits: data.annualVisits,
    annualTotalHours: data.annualTotalHours,
    visitDuration: data.visitDuration,
    additionalInfo: data.additionalInfo,
    team: data.team,
    projectType: data.projectType,
    startDate: data.startDate,
    endDate: data.endDate,
    isArchived: data.isArchived,
    createdAt: data.createdAt,
  };
};

const ProjectForm = ({ initialData, onSuccess, onCancel }: ProjectFormProps) => {
  const navigate = useNavigate();
  const { addProjectInfo, updateProjectInfo, teams } = useApp();
  
  const [formData, setFormData] = useState<Omit<ProjectInfo, 'id' | 'createdAt'>>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    contact: {
      name: initialData?.contact.name || '',
      phone: initialData?.contact.phone || '',
      email: initialData?.contact.email || '',
    },
    contract: {
      details: initialData?.contract.details || '',
      documentUrl: initialData?.contract.documentUrl || '',
    },
    irrigation: initialData?.irrigation || 'none',
    mowerType: initialData?.mowerType || 'both',
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };
  
  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contract: {
        ...prev.contract,
        [name]: value,
      },
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/projects');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) {
      toast.error('Le nom du chantier est requis');
      return;
    }

    if (!formData.team) {
      toast.error('Une équipe doit être sélectionnée');
      return;
    }

    const projectData = convertToProjectInfo(formData);
    
    if (initialData) {
      updateProjectInfo({
        ...projectData,
        id: initialData.id,
        createdAt: initialData.createdAt,
      } as ProjectInfo);
      toast.success('Chantier mis à jour');
    } else {
      addProjectInfo(projectData as ProjectInfo);
      toast.success('Chantier ajouté');
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/projects');
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du chantier</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Contact</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nom du contact</Label>
                  <Input
                    id="contactName"
                    name="name"
                    value={formData.contact.name || ''}
                    onChange={handleContactChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    name="phone"
                    type="tel"
                    value={formData.contact.phone}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    name="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={handleContactChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Contrat</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractDetails">Détails du contrat</Label>
                  <Textarea
                    id="contractDetails"
                    name="details"
                    value={formData.contract.details}
                    onChange={handleContractChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractDocumentUrl">URL du document</Label>
                  <Input
                    id="contractDocumentUrl"
                    name="documentUrl"
                    type="url"
                    value={formData.contract.documentUrl || ''}
                    onChange={handleContractChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="irrigation">Irrigation</Label>
                <Select
                  value={formData.irrigation}
                  onValueChange={(value) => handleSelectChange('irrigation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="disabled">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mowerType">Type de tondeuse</Label>
                <Select
                  value={formData.mowerType}
                  onValueChange={(value) => handleSelectChange('mowerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="large">Grande</SelectItem>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Équipe</Label>
                <TeamsSelect
                  value={formData.team}
                  onValueChange={(value) => handleSelectChange('team', value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualVisits">Nombre de visites annuelles</Label>
                <Input
                  id="annualVisits"
                  name="annualVisits"
                  type="number"
                  min="0"
                  value={formData.annualVisits}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annualTotalHours">Nombre total d'heures annuelles</Label>
                <Input
                  id="annualTotalHours"
                  name="annualTotalHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.annualTotalHours}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visitDuration">Durée d'une visite (heures)</Label>
                <Input
                  id="visitDuration"
                  name="visitDuration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.visitDuration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectType">Type de chantier</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange('projectType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residence">Résidence</SelectItem>
                    <SelectItem value="particular">Particulier</SelectItem>
                    <SelectItem value="enterprise">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleDateChange('startDate', date)}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP")
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange('endDate', date)}
                      disabled={(date) =>
                        date < (formData.startDate || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Informations complémentaires</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Créer le chantier'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProjectForm;
