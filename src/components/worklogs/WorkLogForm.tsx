
import { useState, useEffect } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { calculateTotalHours, formatTime, timeStringToHours } from '@/utils/helpers';
import { useLocation } from 'react-router-dom';

interface WorkLogFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
}

// List of predefined personnel names
const PERSONNEL_NAMES = [
  "Jean Dupont",
  "Marie Martin",
  "Pierre Durand",
  "Sophie Petit",
  "Thomas Bernard",
  "Laura Dubois",
  "Nicolas Moreau",
  "Céline Lambert",
  "Philippe Robert",
  "Isabelle Simon"
];

const WorkLogForm = ({ initialData, onSuccess }: WorkLogFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectInfos, addWorkLog, updateWorkLog, getProjectById } = useApp();
  
  // Extract projectId from URL if present
  const searchParams = new URLSearchParams(location.search);
  const preselectedProjectId = searchParams.get('projectId');
  
  const [personnelCount, setPersonnelCount] = useState(initialData?.personnel.length || 1);
  
  const defaultSelectedProjectId = initialData?.projectId || preselectedProjectId || (projectInfos.length > 0 ? projectInfos[0].id : '');
  const selectedProject = getProjectById(defaultSelectedProjectId);
  
  const [formData, setFormData] = useState<Omit<WorkLog, 'id' | 'createdAt'>>({
    projectId: defaultSelectedProjectId,
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    duration: initialData?.duration || (selectedProject?.visitDuration || 0),
    personnel: initialData?.personnel || Array(personnelCount).fill(''),
    timeTracking: {
      departure: initialData?.timeTracking.departure || '',
      arrival: initialData?.timeTracking.arrival || '',
      breakTime: initialData?.timeTracking.breakTime || '',
      totalHours: initialData?.timeTracking.totalHours || 0,
    },
    tasksPerformed: {
      mowing: initialData?.tasksPerformed.mowing || false,
      brushcutting: initialData?.tasksPerformed.brushcutting || false,
      blower: initialData?.tasksPerformed.blower || false,
      manualWeeding: initialData?.tasksPerformed.manualWeeding || false,
      whiteVinegar: initialData?.tasksPerformed.whiteVinegar || false,
      pruning: {
        done: initialData?.tasksPerformed.pruning.done || false,
        progress: initialData?.tasksPerformed.pruning.progress || 0,
      },
      watering: initialData?.tasksPerformed.watering || 'none',
    },
  });

  // Update duration when project changes
  useEffect(() => {
    if (!initialData) {
      const selectedProject = getProjectById(formData.projectId);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          duration: selectedProject.visitDuration,
        }));
      }
    }
  }, [formData.projectId, getProjectById, initialData]);

  // Update total hours when time tracking changes
  useEffect(() => {
    const totalHours = calculateTotalHours(
      formData.timeTracking.departure,
      formData.timeTracking.arrival,
      formData.timeTracking.breakTime,
      formData.personnel.filter(p => p.trim()).length || personnelCount
    );
    
    setFormData(prev => ({
      ...prev,
      timeTracking: {
        ...prev.timeTracking,
        totalHours,
      },
    }));
  }, [
    formData.timeTracking.departure,
    formData.timeTracking.arrival,
    formData.timeTracking.breakTime,
    formData.personnel,
    personnelCount
  ]);

  const handleProjectChange = (value: string) => {
    const selectedProject = getProjectById(value);
    
    setFormData(prev => ({
      ...prev,
      projectId: value,
      duration: selectedProject?.visitDuration || 0,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      date: new Date(e.target.value),
    }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      duration: parseFloat(e.target.value) || 0,
    }));
  };

  const handlePersonnelChange = (index: number, value: string) => {
    const newPersonnel = [...formData.personnel];
    newPersonnel[index] = value;
    
    setFormData(prev => ({
      ...prev,
      personnel: newPersonnel,
    }));
  };

  const handleAddPersonnel = () => {
    setPersonnelCount(prev => prev + 1);
    setFormData(prev => ({
      ...prev,
      personnel: [...prev.personnel, ''],
    }));
  };

  const handleRemovePersonnel = (index: number) => {
    if (personnelCount <= 1) return;
    
    const newPersonnel = [...formData.personnel];
    newPersonnel.splice(index, 1);
    
    setPersonnelCount(prev => prev - 1);
    setFormData(prev => ({
      ...prev,
      personnel: newPersonnel,
    }));
  };

  const handleTimeChange = (field: 'departure' | 'arrival' | 'breakTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeTracking: {
        ...prev.timeTracking,
        [field]: value,
      },
    }));
  };

  const handleTaskChange = (task: keyof Omit<WorkLog['tasksPerformed'], 'pruning' | 'watering'>, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tasksPerformed: {
        ...prev.tasksPerformed,
        [task]: checked,
      },
    }));
  };

  const handlePruningChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tasksPerformed: {
        ...prev.tasksPerformed,
        pruning: {
          ...prev.tasksPerformed.pruning,
          done: checked,
        },
      },
    }));
  };

  const handlePruningProgressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tasksPerformed: {
        ...prev.tasksPerformed,
        pruning: {
          ...prev.tasksPerformed.pruning,
          progress: parseInt(value) || 0,
        },
      },
    }));
  };

  const handleWateringChange = (value: 'none' | 'on' | 'off') => {
    setFormData(prev => ({
      ...prev,
      tasksPerformed: {
        ...prev.tasksPerformed,
        watering: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.projectId) {
      toast.error('Veuillez sélectionner un chantier');
      return;
    }
    
    if (!formData.date) {
      toast.error('Veuillez sélectionner une date');
      return;
    }
    
    // Filter out empty personnel
    const filteredPersonnel = formData.personnel.filter(p => p.trim());
    if (filteredPersonnel.length === 0) {
      toast.error('Veuillez ajouter au moins un membre du personnel');
      return;
    }
    
    const submissionData = {
      ...formData,
      personnel: filteredPersonnel,
    };
    
    if (initialData) {
      updateWorkLog({ ...submissionData, id: initialData.id, createdAt: initialData.createdAt });
    } else {
      addWorkLog(submissionData);
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/worklogs');
    }
  };

  if (projectInfos.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Aucun chantier disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vous devez créer au moins un chantier avant de pouvoir créer une fiche de suivi.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/projects/new')}>
            Créer un chantier
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium">
            {initialData ? 'Modifier la fiche de suivi' : 'Nouvelle fiche de suivi'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Chantier</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={handleProjectChange}
                  disabled={!!initialData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un chantier" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectInfos.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date du passage</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Durée du passage (heures)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.duration}
                  onChange={handleDurationChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Personnel</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPersonnel}
                >
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-2">
                {Array.from({ length: personnelCount }).map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={formData.personnel[index] || ''}
                      onValueChange={(value) => handlePersonnelChange(index, value)}
                    >
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder={`Personne ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONNEL_NAMES.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Saisie personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {formData.personnel[index] === 'custom' && (
                      <Input
                        placeholder="Nom et prénom"
                        value=""
                        onChange={(e) => handlePersonnelChange(index, e.target.value)}
                        className="flex-grow"
                      />
                    )}
                    
                    {personnelCount > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleRemovePersonnel(index)}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Suivi du temps de travail</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Départ</Label>
                  <Input
                    id="departure"
                    type="time"
                    value={formatTime(formData.timeTracking.departure)}
                    onChange={(e) => handleTimeChange('departure', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arrival">Arrivée</Label>
                  <Input
                    id="arrival"
                    type="time"
                    value={formatTime(formData.timeTracking.arrival)}
                    onChange={(e) => handleTimeChange('arrival', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breakTime">Pause (heures)</Label>
                  <Input
                    id="breakTime"
                    type="number"
                    min="0"
                    step="0.25"
                    value={formData.timeTracking.breakTime}
                    onChange={(e) => handleTimeChange('breakTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-sm font-medium flex justify-between">
                  <span>Total des heures (personnel × temps):</span>
                  <span>{formData.timeTracking.totalHours.toFixed(2)} heures</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Travaux effectués</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mowing"
                      checked={formData.tasksPerformed.mowing}
                      onCheckedChange={(checked) => handleTaskChange('mowing', !!checked)}
                    />
                    <Label htmlFor="mowing">Tonte</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="brushcutting"
                      checked={formData.tasksPerformed.brushcutting}
                      onCheckedChange={(checked) => handleTaskChange('brushcutting', !!checked)}
                    />
                    <Label htmlFor="brushcutting">Débroussailleuse</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="blower"
                      checked={formData.tasksPerformed.blower}
                      onCheckedChange={(checked) => handleTaskChange('blower', !!checked)}
                    />
                    <Label htmlFor="blower">Souffleur</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="manualWeeding"
                      checked={formData.tasksPerformed.manualWeeding}
                      onCheckedChange={(checked) => handleTaskChange('manualWeeding', !!checked)}
                    />
                    <Label htmlFor="manualWeeding">Désherbage manuel</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whiteVinegar"
                      checked={formData.tasksPerformed.whiteVinegar}
                      onCheckedChange={(checked) => handleTaskChange('whiteVinegar', !!checked)}
                    />
                    <Label htmlFor="whiteVinegar">Vinaigre blanc</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pruning"
                      checked={formData.tasksPerformed.pruning.done}
                      onCheckedChange={(checked) => handlePruningChange(!!checked)}
                    />
                    <Label htmlFor="pruning">Taille</Label>
                  </div>
                  
                  {formData.tasksPerformed.pruning.done && (
                    <div className="pl-6">
                      <Label htmlFor="pruningProgress">Pourcentage d'avancement</Label>
                      <Select
                        value={formData.tasksPerformed.pruning.progress.toString()}
                        onValueChange={handlePruningProgressChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pourcentage" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => (
                            <SelectItem key={value} value={value.toString()}>
                              {value}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="watering">Arrosage</Label>
                  <Select
                    value={formData.tasksPerformed.watering}
                    onValueChange={(value) => handleWateringChange(value as 'none' | 'on' | 'off')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="État de l'arrosage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Pas d'arrosage</SelectItem>
                      <SelectItem value="on">Allumé</SelectItem>
                      <SelectItem value="off">Coupé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/worklogs')}
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

export default WorkLogForm;
