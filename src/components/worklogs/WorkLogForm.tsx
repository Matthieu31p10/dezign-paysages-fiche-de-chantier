
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
import { cn } from "@/lib/utils";
import { formatDate } from '@/utils/helpers';
import { addDays, format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PersonnelDialog from './PersonnelDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamsSelect } from '../teams/TeamsSelect';

const formSchema = z.object({
  projectId: z.string().min(1, { message: "Veuillez sélectionner un chantier." }),
  date: z.date({
    required_error: "Une date est requise.",
  }),
  duration: z.number({
    required_error: "La durée est requise.",
    invalid_type_error: "La durée doit être un nombre."
  }).min(0, { message: "La durée doit être positive." }),
  personnel: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins une personne." }),
  departure: z.string().min(1, { message: "L'heure de départ est requise." }),
  arrival: z.string().min(1, { message: "L'heure d'arrivée est requise." }),
  end: z.string().min(1, { message: "L'heure de fin est requise." }),
  breakTime: z.string().default("1"),
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
  teamFilter: z.string().optional().default(""),
});

interface WorkLogFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
}

type FormValues = z.infer<typeof formSchema>;

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

const generateBreakOptions = () => {
  const breaks = [];
  for (let i = 0.25; i <= 3; i += 0.25) {
    breaks.push(i.toFixed(2));
  }
  return breaks;
};

const WorkLogForm: React.FC<WorkLogFormProps> = ({ initialData, onSuccess }) => {
  const { projectInfos, addWorkLog, updateWorkLog, settings, teams } = useApp();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const navigate = useNavigate();
  
  const timeOptions = generateTimeOptions();
  const breakOptions = generateBreakOptions();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: initialData?.projectId || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      duration: initialData?.duration || 0,
      personnel: initialData?.personnel || [],
      departure: initialData?.timeTracking?.departure || "08:00",
      arrival: initialData?.timeTracking?.arrival || "17:00",
      end: initialData?.timeTracking?.end || "17:00",
      breakTime: initialData?.timeTracking?.breakTime || "1",
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
      teamFilter: "",
    },
  });
  
  const { handleSubmit, control, watch, setValue, formState: { errors }, getValues } = form;
  
  const dateValue = watch("date");
  const selectedProjectId = watch("projectId");
  const selectedPersonnel = watch("personnel");
  const teamFilter = watch("teamFilter");
  const departureTime = watch("departure");
  const endTime = watch("end");
  const breakTimeValue = watch("breakTime");
  
  useEffect(() => {
    if (teamFilter) {
      const filtered = projectInfos.filter(p => p.team === teamFilter);
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projectInfos);
    }
  }, [teamFilter, projectInfos]);
  
  useEffect(() => {
    if (selectedProjectId) {
      const project = projectInfos.find(p => p.id === selectedProjectId);
      setSelectedProject(project || null);
      
      if (project && project.visitDuration) {
        setValue('duration', project.visitDuration);
      }
    } else {
      setSelectedProject(null);
    }
  }, [selectedProjectId, projectInfos, setValue]);
  
  useEffect(() => {
    if (departureTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const departureMinutes = getMinutes(departureTime);
      const endMinutes = getMinutes(endTime);
      const breakMinutes = parseFloat(breakTimeValue) * 60;
      
      let totalMinutes = endMinutes - departureMinutes - breakMinutes;
      if (totalMinutes < 0) totalMinutes += 24 * 60;
      
      const totalPersonnelHours = (totalMinutes / 60) * selectedPersonnel.length;
      
      setValue('totalHours', parseFloat(totalPersonnelHours.toFixed(2)));
    }
  }, [departureTime, endTime, breakTimeValue, selectedPersonnel.length, setValue]);
  
  const calculateAverageHourDifference = () => {
    if (!selectedProject) return "N/A";
    
    const completedVisits = projectInfos.filter(log => log.id === selectedProject.id).length;
    
    if (completedVisits === 0) return "N/A";
    
    const averageHoursPerVisit = selectedProject.annualTotalHours / selectedProject.annualVisits;
    
    const difference = averageHoursPerVisit - selectedProject.visitDuration;
    
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(2)} h`;
  };
  
  const getDifferenceClass = (difference: string) => {
    if (difference === "N/A") return "";
    return difference.startsWith('+') ? 'text-red-600' : 'text-green-600';
  };
  
  const handlePersonnelChange = (personnel: string[]) => {
    setValue('personnel', personnel, { shouldValidate: true });
  };
  
  const handleTeamFilterChange = (team: string) => {
    setValue('teamFilter', team);
    if (selectedProjectId) {
      const projectExists = projectInfos.some(p => p.id === selectedProjectId && p.team === team);
      if (!projectExists && team !== "") {
        setValue('projectId', "");
      }
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    const payload = {
      projectId: data.projectId,
      date: data.date,
      duration: data.duration,
      personnel: data.personnel,
      timeTracking: {
        departure: data.departure,
        arrival: data.arrival,
        end: data.end,
        breakTime: data.breakTime,
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
        await updateWorkLog({ ...initialData, ...payload, id: initialData.id });
        toast.success("Fiche de suivi mise à jour avec succès!");
      } else {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teamFilter">Filtrer par équipe</Label>
          <Controller
            name="teamFilter"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => handleTeamFilterChange(value)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les équipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-teams">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
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
                  {filteredProjects.map((project) => (
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
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      "w-full justify-start text-left font-normal",
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
        
        <div>
          <Label htmlFor="duration">Durée prévue (heures)</Label>
          <Input type="number" id="duration" step="0.5"
            {...control.register("duration", {
              valueAsNumber: true,
            })}
            readOnly
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="personnel">Personnel présent</Label>
        <Controller
          name="personnel"
          control={control}
          render={({ field }) => (
            <PersonnelDialog 
              selectedPersonnel={field.value} 
              onChange={handlePersonnelChange}
            />
          )}
        />
        {errors.personnel && (
          <p className="text-sm text-red-500">{errors.personnel.message}</p>
        )}
        {selectedPersonnel.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedPersonnel.map(person => (
              <span 
                key={person}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground"
              >
                {person}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <Label>Heures de travail</Label>
        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead>Heures de départ</TableHead>
              <TableHead>Heures d'arrivée</TableHead>
              <TableHead>Fin du chantier</TableHead>
              <TableHead>Pause (heures)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Controller
                  name="departure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Heure de départ" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`departure-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.departure && (
                  <p className="text-xs text-red-500">{errors.departure.message}</p>
                )}
              </TableCell>
              <TableCell>
                <Controller
                  name="arrival"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Heure d'arrivée" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`arrival-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.arrival && (
                  <p className="text-xs text-red-500">{errors.arrival.message}</p>
                )}
              </TableCell>
              <TableCell>
                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Fin du chantier" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.end && (
                  <p className="text-xs text-red-500">{errors.end.message}</p>
                )}
              </TableCell>
              <TableCell>
                <Controller
                  name="breakTime"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pause" />
                      </SelectTrigger>
                      <SelectContent>
                        {breakOptions.map((breakTime) => (
                          <SelectItem key={`break-${breakTime}`} value={breakTime}>
                            {breakTime} h
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.breakTime && (
                  <p className="text-xs text-red-500">{errors.breakTime.message}</p>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-4 p-3 border rounded-md bg-blue-50">
          <div className="flex justify-between items-center">
            <Label htmlFor="totalHours" className="font-medium">Total des heures (équipe)</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-xl font-bold">
                {getValues("totalHours").toFixed(2)} h
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            (Fin du chantier - Heures de départ - Pause) × Nombre de personnel
          </p>
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
          
          <div className="flex items-start space-x-2">
            <div className="flex items-center space-x-2 mt-0.5">
              <Checkbox id="pruningDone" {...control.register("pruningDone")} />
              <Label htmlFor="pruningDone" className="font-normal">Taille</Label>
            </div>
            
            {watch("pruningDone") && (
              <div className="flex-1">
                <Controller
                  control={control}
                  name="pruningProgress"
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Progression" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="60">60%</SelectItem>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>
        </div>
        
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
