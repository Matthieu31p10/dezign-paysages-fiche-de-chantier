
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { WorkTask } from '@/types/models';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonnelDialog } from '../worklogs/PersonnelDialog';

// Define the form schema
const schema = z.object({
  title: z.string().min(1, 'Ce champ est requis'),
  location: z.string().min(1, 'Ce champ est requis'),
  client: z.object({
    name: z.string().min(1, 'Ce champ est requis'),
    phone: z.string().min(1, 'Ce champ est requis'),
    email: z.string().email('Email invalide'),
  }),
  date: z.date(),
  personnel: z.array(z.string()).min(1, 'Au moins une personne est requise'),
  timeTracking: z.object({
    departure: z.string().min(1, 'Ce champ est requis'),
    arrival: z.string().min(1, 'Ce champ est requis'),
    end: z.string().min(1, 'Ce champ est requis'),
    breakTime: z.string().min(1, 'Ce champ est requis'),
    totalHours: z.number().min(0),
  }),
  tasksPerformed: z.object({
    mowing: z.boolean(),
    brushcutting: z.boolean(),
    blower: z.boolean(),
    manualWeeding: z.boolean(),
    whiteVinegar: z.boolean(),
    pruning: z.object({
      done: z.boolean(),
      progress: z.number().min(0).max(100).optional(),
    }),
    watering: z.enum(['none', 'on', 'off']),
    customTasks: z.record(z.boolean()).optional(),
    tasksProgress: z.record(z.number()).optional(),
  }),
  duration: z.number().min(0.5, 'La durée doit être au moins de 0.5 heure'),
  materials: z.string().optional(),
  notes: z.string().optional(),
  waterConsumption: z.number().min(0).optional(),
  wasteManagement: z.enum(['none', 'one_big_bag', 'two_big_bags', 'half_dumpster', 'one_dumpster']).optional(),
});

type FormData = z.infer<typeof schema>;

interface WorkTaskFormProps {
  initialData?: WorkTask;
  onSuccess?: () => void;
}

const WorkTaskForm: React.FC<WorkTaskFormProps> = ({ initialData, onSuccess }) => {
  const { addWorkTask, updateWorkTask, settings } = useApp();
  const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);
  
  // Initialize form with default values or initial data
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      date: new Date(initialData.date),
    } : {
      title: '',
      location: '',
      client: {
        name: '',
        phone: '',
        email: '',
      },
      date: new Date(),
      personnel: [],
      timeTracking: {
        departure: '',
        arrival: '',
        end: '',
        breakTime: '',
        totalHours: 0,
      },
      tasksPerformed: {
        mowing: false,
        brushcutting: false,
        blower: false,
        manualWeeding: false,
        whiteVinegar: false,
        pruning: {
          done: false,
          progress: 0,
        },
        watering: 'none',
      },
      duration: 0,
      materials: '',
      wasteManagement: 'none',
    },
  });
  
  // Watch form values for conditional fields
  const pruningDone = form.watch('tasksPerformed.pruning.done');
  const wateringValue = form.watch('tasksPerformed.watering');
  const selectedPersonnel = form.watch('personnel');
  
  // Calculate total hours when time fields change
  const calculateTotalHours = () => {
    const departure = form.watch('timeTracking.departure');
    const arrival = form.watch('timeTracking.arrival');
    const end = form.watch('timeTracking.end');
    const breakTime = form.watch('timeTracking.breakTime');
    
    // Implement your calculation logic here
    // This is a simple placeholder
    let totalHours = 0;
    
    form.setValue('timeTracking.totalHours', totalHours);
    form.setValue('duration', totalHours);
  };
  
  const handlePersonnelChange = (selectedNames: string[]) => {
    form.setValue('personnel', selectedNames);
  };
  
  const onSubmit = (data: FormData) => {
    try {
      if (initialData) {
        updateWorkTask({ ...data, id: initialData.id, createdAt: initialData.createdAt });
      } else {
        addWorkTask(data);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving work task:', error);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'intervention *</Label>
                <Input
                  id="title"
                  placeholder="Titre"
                  {...form.register('title')}
                  className="mt-1"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="location">Adresse / Localisation *</Label>
                <Input
                  id="location"
                  placeholder="Adresse du chantier"
                  {...form.register('location')}
                  className="mt-1"
                />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>
              
              <div>
                <Label>Date de l'intervention *</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch('date') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('date') ? format(form.watch('date'), 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch('date')}
                        onSelect={(date) => date && form.setValue('date', date)}
                        locale={fr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  placeholder="Nom du client"
                  {...form.register('client.name')}
                  className="mt-1"
                />
                {form.formState.errors.client?.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.client.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="clientPhone">Téléphone du client *</Label>
                <Input
                  id="clientPhone"
                  placeholder="Numéro de téléphone"
                  {...form.register('client.phone')}
                  className="mt-1"
                />
                {form.formState.errors.client?.phone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.client.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email du client</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="Email"
                  {...form.register('client.email')}
                  className="mt-1"
                />
                {form.formState.errors.client?.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.client.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Personnel *</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedPersonnel.length > 0 ? (
                selectedPersonnel.map((name) => (
                  <div key={name} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm">
                    {name}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Aucun personnel sélectionné</p>
              )}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsPersonnelDialogOpen(true)}
            >
              Sélectionner le personnel
            </Button>
            {form.formState.errors.personnel && (
              <p className="text-red-500 text-sm mt-1">Au moins une personne doit être sélectionnée</p>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-base font-medium mb-3">Suivi du temps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure">Heure de départ du dépôt *</Label>
                <Input
                  id="departure"
                  type="time"
                  {...form.register('timeTracking.departure')}
                  onChange={(e) => {
                    form.setValue('timeTracking.departure', e.target.value);
                    calculateTotalHours();
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="arrival">Heure d'arrivée au chantier *</Label>
                <Input
                  id="arrival"
                  type="time"
                  {...form.register('timeTracking.arrival')}
                  onChange={(e) => {
                    form.setValue('timeTracking.arrival', e.target.value);
                    calculateTotalHours();
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="end">Heure de fin du chantier *</Label>
                <Input
                  id="end"
                  type="time"
                  {...form.register('timeTracking.end')}
                  onChange={(e) => {
                    form.setValue('timeTracking.end', e.target.value);
                    calculateTotalHours();
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="breakTime">Temps de pause (hh:mm) *</Label>
                <Input
                  id="breakTime"
                  placeholder="00:30"
                  {...form.register('timeTracking.breakTime')}
                  onChange={(e) => {
                    form.setValue('timeTracking.breakTime', e.target.value);
                    calculateTotalHours();
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Durée totale (heures) *</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.25"
                  min="0"
                  {...form.register('duration', { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-base font-medium mb-3">Tâches effectuées</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mowing"
                  checked={form.watch('tasksPerformed.mowing')}
                  onCheckedChange={(checked) => 
                    form.setValue('tasksPerformed.mowing', checked as boolean)
                  }
                />
                <Label htmlFor="mowing">Tonte</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brushcutting"
                  checked={form.watch('tasksPerformed.brushcutting')}
                  onCheckedChange={(checked) => 
                    form.setValue('tasksPerformed.brushcutting', checked as boolean)
                  }
                />
                <Label htmlFor="brushcutting">Débroussaillage</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blower"
                  checked={form.watch('tasksPerformed.blower')}
                  onCheckedChange={(checked) => 
                    form.setValue('tasksPerformed.blower', checked as boolean)
                  }
                />
                <Label htmlFor="blower">Soufflage</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manualWeeding"
                  checked={form.watch('tasksPerformed.manualWeeding')}
                  onCheckedChange={(checked) => 
                    form.setValue('tasksPerformed.manualWeeding', checked as boolean)
                  }
                />
                <Label htmlFor="manualWeeding">Désherbage manuel</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whiteVinegar"
                  checked={form.watch('tasksPerformed.whiteVinegar')}
                  onCheckedChange={(checked) => 
                    form.setValue('tasksPerformed.whiteVinegar', checked as boolean)
                  }
                />
                <Label htmlFor="whiteVinegar">Vinaigre blanc</Label>
              </div>
              
              <div className="space-y-2 pl-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pruning"
                    checked={pruningDone}
                    onCheckedChange={(checked) => 
                      form.setValue('tasksPerformed.pruning.done', checked as boolean)
                    }
                  />
                  <Label htmlFor="pruning">Taille</Label>
                </div>
                
                {pruningDone && (
                  <div className="ml-6 mt-2">
                    <Label htmlFor="pruningProgress">Progression de la taille (%)</Label>
                    <Input
                      id="pruningProgress"
                      type="number"
                      min="0"
                      max="100"
                      {...form.register('tasksPerformed.pruning.progress', { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Label>Arrosage</Label>
                <RadioGroup
                  value={wateringValue}
                  onValueChange={(value) => 
                    form.setValue('tasksPerformed.watering', value as 'none' | 'on' | 'off')
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="watering-none" />
                    <Label htmlFor="watering-none">Aucun</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on" id="watering-on" />
                    <Label htmlFor="watering-on">Mise en route</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="off" id="watering-off" />
                    <Label htmlFor="watering-off">Arrêt</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(wateringValue === 'on' || wateringValue === 'off') && (
                <div className="ml-6 mt-2">
                  <Label htmlFor="waterConsumption">Consommation d'eau (m³)</Label>
                  <Input
                    id="waterConsumption"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register('waterConsumption', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
              )}
              
              {/* Custom tasks */}
              {settings.customTasks && settings.customTasks.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h4 className="text-sm font-medium mb-2">Tâches personnalisées</h4>
                  {settings.customTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${task.id}`}
                        checked={form.watch(`tasksPerformed.customTasks.${task.id}`) || false}
                        onCheckedChange={(checked) => {
                          form.setValue(`tasksPerformed.customTasks.${task.id}`, checked as boolean);
                        }}
                      />
                      <Label htmlFor={`custom-${task.id}`}>{task.name}</Label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-base font-medium mb-3">Gestion des déchets</h3>
            <RadioGroup
              value={form.watch('wasteManagement') || 'none'}
              onValueChange={(value) => 
                form.setValue('wasteManagement', value as 'none' | 'one_big_bag' | 'two_big_bags' | 'half_dumpster' | 'one_dumpster')
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="waste-none" />
                <Label htmlFor="waste-none">Aucun</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_big_bag" id="waste-one-bag" />
                <Label htmlFor="waste-one-bag">1 big bag</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="two_big_bags" id="waste-two-bags" />
                <Label htmlFor="waste-two-bags">2 big bags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="half_dumpster" id="waste-half-dump" />
                <Label htmlFor="waste-half-dump">Demi benne</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_dumpster" id="waste-one-dump" />
                <Label htmlFor="waste-one-dump">Une benne</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="materials">Matériel utilisé</Label>
            <Textarea
              id="materials"
              placeholder="Liste du matériel utilisé pour ce chantier"
              {...form.register('materials')}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              placeholder="Observations, commentaires..."
              {...form.register('notes')}
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? 'Mettre à jour' : 'Créer la fiche'}
        </Button>
      </div>
      
      <PersonnelDialog
        open={isPersonnelDialogOpen}
        onOpenChange={setIsPersonnelDialogOpen}
        selected={selectedPersonnel}
        onSelectionChange={handlePersonnelChange}
      />
    </form>
  );
};

export default WorkTaskForm;
