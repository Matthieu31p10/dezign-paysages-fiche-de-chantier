
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blankWorkSheetSchema, BlankWorkSheetValues } from './schema';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Loader2, Trash2, Droplets } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TimeTrackingSection from './TimeTrackingSection';
import TasksSection from './TasksSection';
import WasteManagementSection from './WasteManagementSection';
import { useEffect } from 'react';
import { calculateTotalHours } from '@/utils/time';

interface BlankWorkSheetFormProps {
  onSuccess?: () => void;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({ onSuccess }) => {
  const { teams, settings, addWorkLog } = useApp();
  const [teamFilter, setTeamFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(blankWorkSheetSchema),
    defaultValues: {
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      watering: 'none',
      wasteManagement: 'none',
      teamFilter: '',
    }
  });
  
  // Effect to calculate total hours based on time inputs
  useEffect(() => {
    const departureTime = form.watch("departure");
    const arrivalTime = form.watch("arrival");
    const endTime = form.watch("end");
    const breakTimeValue = form.watch("breakTime");
    const selectedPersonnel = form.watch("personnel");
    
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      try {
        const calculatedTotalHours = calculateTotalHours(
          departureTime,
          arrivalTime,
          endTime,
          breakTimeValue,
          selectedPersonnel.length
        );
        
        form.setValue('totalHours', Number(calculatedTotalHours));
      } catch (error) {
        console.error("Error calculating total hours:", error);
      }
    }
  }, [form.watch("departure"), form.watch("arrival"), form.watch("end"), form.watch("breakTime"), form.watch("personnel").length, form]);
  
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    try {
      setIsSubmitting(true);
      
      // Convertir en format WorkLog pour stockage
      const workLogData = {
        projectId: 'blank-' + Date.now().toString(),
        date: data.date,
        duration: data.totalHours,
        personnel: data.personnel,
        timeTracking: {
          departure: data.departure,
          arrival: data.arrival,
          end: data.end,
          breakTime: data.breakTime,
          totalHours: data.totalHours
        },
        tasksPerformed: {
          mowing: false,
          brushcutting: false,
          blower: false,
          manualWeeding: false,
          whiteVinegar: false,
          pruning: {
            done: false,
            progress: 0
          },
          watering: data.watering,
          customTasks: data.customTasks,
          tasksProgress: data.tasksProgress
        },
        notes: `CLIENT: ${data.clientName}\nADRESSE: ${data.address}\n${data.contactPhone ? 'TÉL: ' + data.contactPhone + '\n' : ''}${data.contactEmail ? 'EMAIL: ' + data.contactEmail + '\n' : ''}\n\nDESCRIPTION DES TRAVAUX:\n${data.workDescription}\n\n${data.notes || ''}`,
        waterConsumption: data.waterConsumption,
        wasteManagement: data.wasteManagement
      };
      
      // Ajouter au système
      addWorkLog(workLogData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la fiche:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTeamFilterChange = (value: string) => {
    setTeamFilter(value);
    form.setValue('teamFilter', value);
  };
  
  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    form.setValue('personnel', selectedPersonnel);
  };
  
  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Informations Client</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse du chantier" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Détails de l'intervention</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Équipe</FormLabel>
              <Select value={teamFilter} onValueChange={handleTeamFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une équipe (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="workDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description des travaux</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez les travaux à effectuer..." 
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Card>
            <CardContent className="pt-4">
              <FormField
                control={form.control}
                name="personnel"
                render={() => (
                  <FormItem>
                    <FormLabel>Personnel</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {settings.personnel
                        ?.filter(p => p.active && (!teamFilter || teams.find(t => t.id === teamFilter)?.name === p.position))
                        .map((person) => (
                          <div
                            key={person.id}
                            className={cn(
                              "border rounded-full px-3 py-1 cursor-pointer text-sm transition-colors",
                              form.watch('personnel')?.includes(person.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted"
                            )}
                            onClick={() => {
                              const current = form.watch('personnel') || [];
                              const updated = current.includes(person.id)
                                ? current.filter((id) => id !== person.id)
                                : [...current, person.id];
                              handlePersonnelChange(updated);
                            }}
                          >
                            {person.name}
                          </div>
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <TimeTrackingSection />
        
        <Separator />
        
        <TasksSection />
        
        <Separator />
        
        <WasteManagementSection />
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-muted-foreground" />
            Consommation d'eau
          </h2>
          
          <FormField
            control={form.control}
            name="waterConsumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consommation d'eau (m³)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes supplémentaires</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informations complémentaires..." 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-32"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting 
              ? "Création..." 
              : "Créer la fiche"
            }
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BlankWorkSheetForm;
