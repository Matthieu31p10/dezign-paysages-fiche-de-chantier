import React, { useState, useEffect } from 'react';
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
import { Loader2, Trash2, Clock, InfoIcon, CalendarIcon, ClipboardList, LinkIcon, Calculator } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WasteManagementSection from './WasteManagementSection';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';
import { calculateTotalHours } from '@/utils/time';
import { toast } from 'sonner';
import { useProjects } from '@/context/ProjectsContext';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { WorkLog } from '@/types/models';
import TasksSection from './TasksSection';
import ConsumablesSection from './ConsumablesSection';
import WorksheetSummary from './WorksheetSummary';

interface BlankWorkSheetFormProps {
  onSuccess?: () => void;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({ onSuccess }) => {
  const { teams, settings, addWorkLog } = useApp();
  const [teamFilter, setTeamFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openProjectsCombobox, setOpenProjectsCombobox] = useState(false);
  const { getActiveProjects } = useProjects();
  
  const activeProjects = getActiveProjects();
  
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
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      customTasks: {},
      consumables: [],
      vatRate: "20",
      signedQuote: false,
    }
  });
  
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
  
  useEffect(() => {
    if (selectedProject) {
      const project = activeProjects.find(p => p.id === selectedProject);
      if (project) {
        form.setValue('clientName', project.clientName || project.contact?.name || '');
        form.setValue('address', project.address || '');
        form.setValue('contactPhone', project.contactPhone || project.contact?.phone || '');
        form.setValue('contactEmail', project.contactEmail || project.contact?.email || '');
        form.setValue('linkedProjectId', project.id);
      }
    }
  }, [selectedProject, activeProjects, form]);
  
  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setOpenProjectsCombobox(false);
  };
  
  const handleClearProject = () => {
    setSelectedProject(null);
    form.setValue('linkedProjectId', '');
  };
  
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    try {
      setIsSubmitting(true);
      
      if (!data.clientName.trim()) {
        toast.error("Le nom du client est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.address.trim()) {
        toast.error("L'adresse est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.workDescription?.trim()) {
        toast.error("La description des travaux est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      let notesWithProjectInfo = `CLIENT: ${data.clientName}\nADRESSE: ${data.address}\n${data.contactPhone ? 'TÉL: ' + data.contactPhone + '\n' : ''}${data.contactEmail ? 'EMAIL: ' + data.contactEmail + '\n' : ''}`;
      
      if (data.linkedProjectId) {
        notesWithProjectInfo += `PROJET_LIE: ${data.linkedProjectId}\n`;
      }
      
      notesWithProjectInfo += `\nTAUX HORAIRE: ${data.hourlyRate?.toFixed(2) || '0.00'} €\n`;
      notesWithProjectInfo += `TAUX TVA: ${data.vatRate}%\n`;
      notesWithProjectInfo += `DEVIS SIGNÉ: ${data.signedQuote ? 'OUI' : 'NON'}\n`;
      
      const validConsumables = data.consumables?.filter(c => c.product && c.unit)
        .map(c => ({
          supplier: c.supplier || '',
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice
        })) || [];
      
      notesWithProjectInfo += `\nCONSOMMATIONS:\n`;
      validConsumables.forEach((item, index) => {
        if (item.product && item.unit) {
          notesWithProjectInfo += `${index + 1}. ${item.product} (${item.supplier || 'N/A'}): ${item.quantity} ${item.unit} x ${item.unitPrice.toFixed(2)} € = ${item.totalPrice.toFixed(2)} €\n`;
        }
      });
      
      const totalConsumables = validConsumables.reduce((sum, item) => sum + item.totalPrice, 0);
      notesWithProjectInfo += `Total consommables: ${totalConsumables.toFixed(2)} €\n`;
      
      const laborCost = data.totalHours * (data.hourlyRate || 0);
      notesWithProjectInfo += `Coût main d'œuvre: ${laborCost.toFixed(2)} €\n`;
      
      const totalHT = laborCost + totalConsumables;
      notesWithProjectInfo += `TOTAL HT: ${totalHT.toFixed(2)} €\n`;
      
      const vatAmount = totalHT * (parseInt(data.vatRate) / 100);
      notesWithProjectInfo += `TVA (${data.vatRate}%): ${vatAmount.toFixed(2)} €\n`;
      
      const totalTTC = totalHT + vatAmount;
      notesWithProjectInfo += `TOTAL TTC: ${totalTTC.toFixed(2)} €\n`;
      
      notesWithProjectInfo += `\nDESCRIPTION DES TRAVAUX:\n${data.workDescription}\n\n${data.notes || ''}`;
      
      const customTasks = data.customTasks || {};
      
      const workLogData: Omit<WorkLog, 'id' | 'createdAt'> = {
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
          mowing: customTasks.mowing || false,
          brushcutting: customTasks.brushcutting || false,
          blower: customTasks.blower || false,
          manualWeeding: customTasks.manualWeeding || false,
          whiteVinegar: customTasks.whiteVinegar || false,
          pruning: {
            done: customTasks.pruning || false,
            progress: 0
          },
          watering: 'none',
          customTasks: customTasks,
          tasksProgress: data.tasksProgress
        },
        notes: notesWithProjectInfo,
        wasteManagement: data.wasteManagement,
        consumables: validConsumables
      };
      
      addWorkLog(workLogData);
      
      toast.success("Fiche vierge créée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset({
        clientName: '',
        address: '',
        date: new Date(),
        personnel: [],
        departure: '08:00',
        arrival: '08:30',
        end: '16:30',
        breakTime: '00:30',
        totalHours: 7.5,
        hourlyRate: 0,
        wasteManagement: 'none',
        teamFilter: 'all',
        linkedProjectId: '',
        customTasks: {},
        consumables: [],
        vatRate: "20",
        signedQuote: false,
      });
      
      setSelectedProject(null);
      
    } catch (error) {
      console.error('Erreur lors de la création de la fiche:', error);
      toast.error("Erreur lors de la création de la fiche");
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
          <h2 className="text-lg font-medium flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-muted-foreground" />
            Associer à un projet existant (optionnel)
          </h2>
          
          <Popover open={openProjectsCombobox} onOpenChange={setOpenProjectsCombobox}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProjectsCombobox}
                  className={cn(
                    "w-full justify-between",
                    !selectedProject && "text-muted-foreground"
                  )}
                >
                  {selectedProject ? 
                    activeProjects.find(project => project.id === selectedProject)?.name :
                    "Sélectionner un projet existant..."
                  }
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un projet..." />
                <CommandList>
                  <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
                  <CommandGroup>
                    {activeProjects.map(project => (
                      <CommandItem
                        key={project.id}
                        value={project.id}
                        onSelect={() => handleProjectSelect(project.id)}
                      >
                        {project.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedProject && (
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-destructive"
                    onClick={handleClearProject}
                  >
                    Effacer la sélection
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          {selectedProject && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Projet sélectionné: {activeProjects.find(p => p.id === selectedProject)?.name}</p>
              <p className="text-muted-foreground">Les informations du client ont été préremplies.</p>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium flex items-center">
            <InfoIcon className="mr-2 h-5 w-5 text-muted-foreground" />
            Informations Client
          </h2>
          
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
                    <Input placeholder="Adresse email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
            Détails de l'intervention
          </h2>
          
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
                          variant="outline"
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
                  <SelectItem value="all">Toutes les équipes</SelectItem>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personnel</FormLabel>
                    <FormControl>
                      <PersonnelDialog 
                        selectedPersonnel={field.value} 
                        onChange={handlePersonnelChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            Suivi du temps
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Départ</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="arrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrivée</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fin de chantier</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="breakTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de pause</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total des heures (calculé automatiquement)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      readOnly
                      value={field.value.toFixed(2)}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux horaire (€/h)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-muted-foreground">€/h</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        <TasksSection />
        
        <Separator />
        
        <WasteManagementSection />
        
        <Separator />
        
        <ConsumablesSection />
        
        <Separator />
        
        <WorksheetSummary />
        
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
