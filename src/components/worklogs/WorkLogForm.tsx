
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/AppContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  projectId: z.string().min(1, { message: "Veuillez sélectionner un chantier." }),
  date: z.date({
    required_error: "Une date est requise.",
  }),
  duration: z.number({
    required_error: "La durée est requise.",
    invalid_type_error: "La durée doit être un nombre."
  }).min(0, { message: "La durée doit être positive." }),
  personnel: z.string().min(1, { message: "Veuillez entrer le nom du personnel présent." }),
  departure: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Format HH:MM requis." }),
  arrival: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Format HH:MM requis." }),
  breakTime: z.number({
    required_error: "Le temps de pause est requis.",
    invalid_type_error: "Le temps de pause doit être un nombre."
  }).min(0, { message: "Le temps de pause doit être positive." }),
  totalHours: z.number({
    required_error: "Le total d'heures est requis.",
    invalid_type_error: "Le total d'heures doit être un nombre."
  }).min(0, { message: "Le total d'heures doit être positive." }),
  mowing: z.boolean().default(false),
  brushcutting: z.boolean().default(false),
  blower: z.boolean().default(false),
  manualWeeding: z.boolean().default(false),
  whiteVinegar: z.boolean().default(false),
  pruningDone: z.boolean().default(false),
  pruningProgress: z.number().min(0).max(100).default(0),
  watering: z.enum(['none', 'on', 'off']).default('none'),
  notes: z.string().optional(),
  waterConsumption: z.number().optional(),
});

interface WorkLogFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
}

type FormValues = z.infer<typeof formSchema>;

const WorkLogForm: React.FC<WorkLogFormProps> = ({ initialData, onSuccess }) => {
  const { projectInfos, addWorkLog, updateWorkLog, settings } = useApp();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [personnelList, setPersonnelList] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: initialData?.projectId || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      duration: initialData?.duration || 0,
      personnel: initialData?.personnel?.join(', ') || "",
      departure: initialData?.timeTracking?.departure || "08:00",
      arrival: initialData?.timeTracking?.arrival || "17:00",
      breakTime: typeof initialData?.timeTracking?.breakTime === 'string' 
        ? parseFloat(initialData.timeTracking.breakTime) 
        : initialData?.timeTracking?.breakTime || 1,
      totalHours: initialData?.timeTracking?.totalHours || 8,
      mowing: initialData?.tasksPerformed?.mowing || false,
      brushcutting: initialData?.tasksPerformed?.brushcutting || false,
      blower: initialData?.tasksPerformed?.blower || false,
      manualWeeding: initialData?.tasksPerformed?.manualWeeding || false,
      whiteVinegar: initialData?.tasksPerformed?.whiteVinegar || false,
      pruningDone: initialData?.tasksPerformed?.pruning?.done || false,
      pruningProgress: initialData?.tasksPerformed?.pruning?.progress || 0,
      watering: initialData?.tasksPerformed?.watering || 'none',
      notes: initialData?.notes || "",
      waterConsumption: initialData?.waterConsumption || undefined,
    },
  });
  
  useEffect(() => {
    if (initialData) {
      // When editing, set the personnel list from initial data
      setPersonnelList(initialData.personnel);
    }
  }, [initialData]);
  
  const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
  
  const dateValue = watch("date");
  const selectedProjectId = watch("projectId");
  
  useEffect(() => {
    if (selectedProjectId) {
      const project = projectInfos.find(p => p.id === selectedProjectId);
      setSelectedProject(project || null);
    } else {
      setSelectedProject(null);
    }
  }, [selectedProjectId, projectInfos]);
  
  const calculateAverageHourDifference = () => {
    if (!selectedProject) return "N/A";
    
    const projectWorklogs = projectInfos
      .filter(p => p.id === selectedProject.id)
      .flatMap(p => p.workLogs || []);
    
    if (projectWorklogs.length === 0) return "N/A";
    
    const totalHours = projectWorklogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    const averageHoursPerVisit = totalHours / projectWorklogs.length;
    
    const difference = averageHoursPerVisit - selectedProject.visitDuration;
    
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(2)} h`;
  };
  
  const getDifferenceClass = (difference: string) => {
    if (difference === "N/A") return "";
    return difference.startsWith('+') ? 'text-red-600' : 'text-green-600';
  };
  
  const onSubmit = async (data: FormValues) => {
    const personnelArray = data.personnel.split(',').map(item => item.trim());
    
    const payload: Omit<WorkLog, 'id' | 'createdAt'> = {
      projectId: data.projectId,
      date: data.date,
      duration: data.duration,
      personnel: personnelArray,
      timeTracking: {
        departure: data.departure,
        arrival: data.arrival,
        end: "17:00", // Default value
        breakTime: data.breakTime.toString(), // Convert to string
        totalHours: data.totalHours,
      },
      tasksPerformed: {
        mowing: data.mowing,
        brushcutting: data.brushcutting,
        blower: data.blower,
        manualWeeding: data.manualWeeding,
        whiteVinegar: data.whiteVinegar,
        pruning: {
          done: data.pruningDone,
          progress: data.pruningProgress,
        },
        watering: data.watering,
      },
      notes: data.notes,
      waterConsumption: data.waterConsumption,
    };
    
    try {
      if (initialData) {
        // Update existing work log
        await updateWorkLog({ ...payload, id: initialData.id, createdAt: initialData.createdAt });
        toast.success("Fiche de suivi mise à jour avec succès!");
      } else {
        // Create new work log
        await addWorkLog(payload);
        toast.success("Fiche de suivi créée avec succès!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      navigate('/worklogs');
    } catch (error) {
      console.error("Error saving work log:", error);
      toast.error("Erreur lors de la sauvegarde de la fiche de suivi.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Label htmlFor="projectId">Chantier</Label>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un chantier" />
              </SelectTrigger>
              <SelectContent>
                {projectInfos.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.projectId && (
          <p className="text-sm text-red-500">{errors.projectId.message}</p>
        )}
      </div>
      
      <div>
        <Label>Date</Label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? formatDate(dateValue) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < addDays(new Date(), -365)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Durée prévue (heures)</Label>
          <Input type="number" id="duration" step="0.5"
            {...control.register("duration", {
              valueAsNumber: true,
            })}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personnel">Personnel présent (séparé par des virgules)</Label>
          <Input type="text" id="personnel"
            {...control.register("personnel")}
          />
          {errors.personnel && (
            <p className="text-sm text-red-500">{errors.personnel.message}</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departure">Heure de départ</Label>
          <Input type="text" id="departure"
            {...control.register("departure")}
          />
          {errors.departure && (
            <p className="text-sm text-red-500">{errors.departure.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="arrival">Heure d'arrivée</Label>
          <Input type="text" id="arrival"
            {...control.register("arrival")}
          />
          {errors.arrival && (
            <p className="text-sm text-red-500">{errors.arrival.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="breakTime">Temps de pause (heures)</Label>
          <Input type="number" id="breakTime" step="0.5"
            {...control.register("breakTime", {
              valueAsNumber: true,
            })}
          />
          {errors.breakTime && (
            <p className="text-sm text-red-500">{errors.breakTime.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="totalHours">Total d'heures</Label>
          <Input type="number" id="totalHours" step="0.5"
            {...control.register("totalHours", {
              valueAsNumber: true,
            })}
          />
          {errors.totalHours && (
            <p className="text-sm text-red-500">{errors.totalHours.message}</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <Label>Travaux effectués</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="mowing" className="flex items-center space-x-2">
              <Checkbox id="mowing" {...control.register("mowing")} />
              <span>Tonte</span>
            </Label>
          </div>
          
          <div>
            <Label htmlFor="brushcutting" className="flex items-center space-x-2">
              <Checkbox id="brushcutting" {...control.register("brushcutting")} />
              <span>Débroussaillage</span>
            </Label>
          </div>
          
          <div>
            <Label htmlFor="blower" className="flex items-center space-x-2">
              <Checkbox id="blower" {...control.register("blower")} />
              <span>Soufflage</span>
            </Label>
          </div>
          
          <div>
            <Label htmlFor="manualWeeding" className="flex items-center space-x-2">
              <Checkbox id="manualWeeding" {...control.register("manualWeeding")} />
              <span>Désherbage manuel</span>
            </Label>
          </div>
          
          <div>
            <Label htmlFor="whiteVinegar" className="flex items-center space-x-2">
              <Checkbox id="whiteVinegar" {...control.register("whiteVinegar")} />
              <span>Vinaigre blanc</span>
            </Label>
          </div>
          
          <div>
            <Label htmlFor="pruningDone" className="flex items-center space-x-2">
              <Checkbox id="pruningDone" {...control.register("pruningDone")} />
              <span>Taille</span>
            </Label>
          </div>
        </div>
        
        {watch("pruningDone") && (
          <div className="mt-4">
            <Label htmlFor="pruningProgress">Avancement de la taille</Label>
            <Controller
              control={control}
              name="pruningProgress"
              render={({ field }) => (
                <Slider
                  defaultValue={[field.value]}
                  max={100}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            />
            <p className="text-sm text-muted-foreground">
              {watch("pruningProgress")}%
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <Label htmlFor="watering">Arrosage</Label>
          <Controller
            name="watering"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pas d'arrosage</SelectItem>
                  <SelectItem value="on">Allumé</SelectItem>
                  <SelectItem value="off">Coupé</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      
      {selectedProject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={`font-medium ${
                getDifferenceClass(calculateAverageHourDifference())
              }`}>
                {calculateAverageHourDifference()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Écart entre (heures effectuées / passages) et durée prévue
            </p>
          </div>
          
          {selectedProject.irrigation !== 'none' && (
            <div>
              <Label htmlFor="waterConsumption">Consommation d'eau (m³)</Label>
              <Input type="number" id="waterConsumption" step="0.1"
                {...control.register("waterConsumption", {
                  valueAsNumber: true,
                })}
              />
              {errors.waterConsumption && (
                <p className="text-sm text-red-500">{errors.waterConsumption.message}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div>
        <Label htmlFor="notes">Notes et observations</Label>
        <Textarea id="notes" placeholder="Ajouter des notes ici..."
          {...control.register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>
      
      <Button type="submit">
        {initialData ? "Mettre à jour la fiche" : "Créer la fiche"}
      </Button>
    </form>
  );
};

export default WorkLogForm;
