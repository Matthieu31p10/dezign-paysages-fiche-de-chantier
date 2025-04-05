
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import PersonnelDialog from './PersonnelDialog';
import { WorkTask } from '@/types/models';

interface WorkTaskFormProps {
  initialData?: WorkTask;
  onSuccess?: () => void;
}

const WorkTaskForm: React.FC<WorkTaskFormProps> = ({ initialData, onSuccess }) => {
  const navigate = useNavigate();
  const { addWorkTask, updateWorkTask } = useApp();
  
  const [formData, setFormData] = useState<Omit<WorkTask, 'id' | 'createdAt'>>({
    title: initialData?.title || '',
    location: initialData?.location || '',
    client: {
      name: initialData?.client?.name || '',
      phone: initialData?.client?.phone || '',
      email: initialData?.client?.email || '',
    },
    date: initialData?.date || new Date(),
    duration: initialData?.duration || 0,
    personnel: initialData?.personnel || [],
    timeTracking: {
      departure: initialData?.timeTracking?.departure || '08:00',
      arrival: initialData?.timeTracking?.arrival || '08:30',
      end: initialData?.timeTracking?.end || '17:00',
      breakTime: initialData?.timeTracking?.breakTime || '01:00',
      totalHours: initialData?.timeTracking?.totalHours || 7.5,
    },
    tasksPerformed: {
      mowing: initialData?.tasksPerformed?.mowing || false,
      brushcutting: initialData?.tasksPerformed?.brushcutting || false,
      blower: initialData?.tasksPerformed?.blower || false,
      manualWeeding: initialData?.tasksPerformed?.manualWeeding || false,
      whiteVinegar: initialData?.tasksPerformed?.whiteVinegar || false,
      pruning: {
        done: initialData?.tasksPerformed?.pruning?.done || false,
        progress: initialData?.tasksPerformed?.pruning?.progress || 0,
      },
      watering: initialData?.tasksPerformed?.watering || 'none',
      customTasks: initialData?.tasksPerformed?.customTasks || {},
      tasksProgress: initialData?.tasksPerformed?.tasksProgress || {},
    },
    materials: initialData?.materials || '',
    notes: initialData?.notes || '',
    waterConsumption: initialData?.waterConsumption || 0,
    wasteManagement: initialData?.wasteManagement || 'none',
  });
  
  const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [name]: value,
      },
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      timeTracking: {
        ...prev.timeTracking,
        [name]: value,
      },
    }));
  };
  
  const handlePersonnelChange = (selected: string[]) => {
    setFormData(prev => ({
      ...prev,
      personnel: selected,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title) {
      toast.error('Le titre est requis');
      return;
    }
    
    if (!formData.date) {
      toast.error('La date est requise');
      return;
    }

    if (formData.personnel.length === 0) {
      toast.error('Au moins un membre du personnel est requis');
      return;
    }

    try {
      if (initialData) {
        // Update existing task
        updateWorkTask({
          ...initialData,
          ...formData,
        });
        toast.success('Fiche de travaux mise à jour');
      } else {
        // Create new task
        addWorkTask(formData);
        toast.success('Fiche de travaux créée');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/worktasks');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium">
            {initialData ? 'Modifier la fiche de travaux' : 'Nouvelle fiche de travaux'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Informations de base */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre des travaux</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Taille de haie, Élagage..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Adresse des travaux"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Informations du client */}
            <div className="space-y-2">
              <Label>Informations client</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom</Label>
                  <Input
                    id="clientName"
                    name="name"
                    value={formData.client.name}
                    onChange={handleClientChange}
                    placeholder="Nom du client"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Téléphone</Label>
                  <Input
                    id="clientPhone"
                    name="phone"
                    value={formData.client.phone}
                    onChange={handleClientChange}
                    placeholder="Numéro de téléphone"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    name="email"
                    type="email"
                    value={formData.client.email}
                    onChange={handleClientChange}
                    placeholder="Email du client"
                  />
                </div>
              </div>
            </div>
            
            {/* Suivi du temps */}
            <div className="space-y-2">
              <Label>Suivi du temps</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Départ</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="departure"
                      name="departure"
                      type="time"
                      value={formData.timeTracking.departure}
                      onChange={handleTimeChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arrival">Arrivée</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="arrival"
                      name="arrival"
                      type="time"
                      value={formData.timeTracking.arrival}
                      onChange={handleTimeChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end">Fin</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end"
                      name="end"
                      type="time"
                      value={formData.timeTracking.end}
                      onChange={handleTimeChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breakTime">Pause</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="breakTime"
                      name="breakTime"
                      type="time"
                      value={formData.timeTracking.breakTime}
                      onChange={handleTimeChange}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Personnel */}
            <div className="space-y-2">
              <Label>Personnel</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-between"
                onClick={() => setIsPersonnelDialogOpen(true)}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {formData.personnel.length === 0 
                    ? "Sélectionner le personnel" 
                    : `${formData.personnel.length} personne(s) sélectionnée(s)`
                  }
                </span>
              </Button>
              {formData.personnel.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.personnel.map(name => (
                    <div key={name} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Matériel */}
            <div className="space-y-2">
              <Label htmlFor="materials">Matériel utilisé</Label>
              <Textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                placeholder="Liste du matériel utilisé..."
              />
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes complémentaires</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/worktasks')}
          >
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Créer la fiche'}
          </Button>
        </CardFooter>
      </Card>
      
      <PersonnelDialog
        open={isPersonnelDialogOpen}
        onOpenChange={setIsPersonnelDialogOpen}
        selected={formData.personnel}
        onSelectionChange={handlePersonnelChange}
      />
    </form>
  );
};

export default WorkTaskForm;
