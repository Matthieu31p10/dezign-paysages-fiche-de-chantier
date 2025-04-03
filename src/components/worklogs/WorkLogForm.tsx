import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '@/context/AppContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { calculateTotalHours } from '@/utils/time';

// Import schema and sub-components
import { formSchema, FormValues } from './form/schema';
import HeaderSection from './form/HeaderSection';
import TimeTrackingSection from './form/TimeTrackingSection';
import TasksSection from './form/TasksSection';
import ProjectInfoCard from './form/ProjectInfoCard';
import ProjectExtraFields from './form/ProjectExtraFields';
import NotesSection from './form/NotesSection';
import ActionButtons from './form/ActionButtons';

interface WorkLogFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

const WorkLogForm: React.FC<WorkLogFormProps> = ({ 
  initialData, 
  onSuccess, 
  projectInfos, 
  existingWorkLogs 
}) => {
  const { addWorkLog, updateWorkLog, settings, teams } = useApp();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const [timeDeviation, setTimeDeviation] = useState<string>("N/A");
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>("");
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: initialData?.projectId || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      duration: initialData?.duration || 0,
      personnel: initialData?.personnel || [],
      departure: initialData?.timeTracking?.departure || "08:00",
      arrival: initialData?.timeTracking?.arrival || "09:00",
      end: initialData?.timeTracking?.end || "17:00",
      breakTime: initialData?.timeTracking?.breakTime || "00:00",
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
  
  const { handleSubmit, control, watch, setValue, formState: { errors }, getValues, register } = form;
  
  const selectedProjectId = watch("projectId");
  const teamFilter = watch("teamFilter");
  const departureTime = watch("departure");
  const arrivalTime = watch("arrival");
  const endTime = watch("end");
  const breakTimeValue = watch("breakTime");
  const totalHours = watch("totalHours");
  const selectedPersonnel = watch("personnel");
  
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
      
      calculateTimeDeviation(project);
    } else {
      setSelectedProject(null);
      setTimeDeviation("N/A");
      setTimeDeviationClass("");
    }
  }, [selectedProjectId, projectInfos, setValue]);
  
  useEffect(() => {
    if (selectedProject && totalHours) {
      calculateTimeDeviation(selectedProject);
    }
  }, [totalHours, selectedProject]);
  
  useEffect(() => {
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      const calculatedTotalHours = calculateTotalHours(
        departureTime,
        arrivalTime,
        endTime,
        breakTimeValue,
        selectedPersonnel.length
      );
      
      setValue('totalHours', calculatedTotalHours);
    }
  }, [departureTime, arrivalTime, endTime, breakTimeValue, selectedPersonnel.length, setValue]);
  
  const calculateTimeDeviation = (project: ProjectInfo | null) => {
    if (!project) {
      setTimeDeviation("N/A");
      setTimeDeviationClass("");
      return;
    }
    
    const projectWorkLogs = existingWorkLogs.filter(log => log.projectId === project.id);
    const completedVisits = projectWorkLogs.length;
    
    if (completedVisits === 0) {
      setTimeDeviation("N/A");
      setTimeDeviationClass("");
      return;
    }
    
    const totalHoursCompleted = projectWorkLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    const difference = project.visitDuration - averageHoursPerVisit;
    
    const sign = difference >= 0 ? '+' : '';
    const formattedDifference = `${sign}${difference.toFixed(2)} h`;
    
    setTimeDeviation(formattedDifference);
    setTimeDeviationClass(difference >= 0 ? 'text-green-600' : 'text-red-600');
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
  
  const handleCancel = () => {
    navigate('/worklogs');
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
      <HeaderSection 
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        teams={teams}
        filteredProjects={filteredProjects}
        handleTeamFilterChange={handleTeamFilterChange}
        handlePersonnelChange={handlePersonnelChange}
      />
      
      <Separator />
      
      <TimeTrackingSection 
        control={control}
        errors={errors}
        watch={watch}
        getValues={getValues}
      />
      
      <Separator />
      
      <TasksSection 
        control={control}
        register={register}
        watch={watch}
      />
      
      {selectedProject && (
        <ProjectInfoCard 
          project={selectedProject}
          timeDeviation={timeDeviation}
          timeDeviationClass={timeDeviationClass}
        />
      )}
      
      {selectedProject && (
        <ProjectExtraFields 
          project={selectedProject}
          register={register}
          errors={errors}
          existingWorkLogs={existingWorkLogs}
        />
      )}
      
      <NotesSection 
        register={register}
        errors={errors}
      />
      
      <ActionButtons 
        onCancel={handleCancel}
        isEditing={!!initialData}
      />
    </form>
  );
};

export default WorkLogForm;
