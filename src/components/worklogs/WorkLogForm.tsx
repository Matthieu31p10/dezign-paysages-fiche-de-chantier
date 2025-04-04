
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '@/context/AppContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { calculateTotalHours } from '@/utils/time';

// Import schema and sub-components
import { formSchema, FormValues } from './form/schema';
import HeaderSection from './form/HeaderSection';
import TimeTrackingSection from './form/TimeTrackingSection';
import TasksSection from './form/TasksSection';
import NotesSection from './form/NotesSection';
import ActionButtons from './form/ActionButtons';
import { WorkLogFormProvider } from './form/WorkLogFormContext';
import ProjectInfoSection from './form/ProjectInfoSection';
import WorkLogFormSubmitHandler from './form/WorkLogFormSubmitHandler';

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
  const { teams } = useApp();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const [timeDeviation, setTimeDeviation] = useState<string>("N/A");
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>("");
  const navigate = useNavigate();
  
  // Préparation des valeurs par défaut pour le formulaire
  const defaultValues: Partial<FormValues> = {
    projectId: initialData?.projectId || "",
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    duration: initialData?.duration || 0,
    personnel: initialData?.personnel || [],
    departure: initialData?.timeTracking?.departure || "08:00",
    arrival: initialData?.timeTracking?.arrival || "09:00",
    end: initialData?.timeTracking?.end || "17:00",
    breakTime: initialData?.timeTracking?.breakTime || "00:00",
    totalHours: initialData?.timeTracking?.totalHours || 8,
    notes: initialData?.notes || "",
    waterConsumption: initialData?.waterConsumption || undefined,
    teamFilter: "",
    customTasks: initialData?.tasksPerformed?.customTasks || {},
    tasksProgress: initialData?.tasksPerformed?.tasksProgress || {},
    watering: initialData?.tasksPerformed?.watering || 'none',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const { watch, setValue } = form;
  
  const selectedProjectId = watch("projectId");
  const teamFilter = watch("teamFilter");
  const departureTime = watch("departure");
  const arrivalTime = watch("arrival");
  const endTime = watch("end");
  const breakTimeValue = watch("breakTime");
  const selectedPersonnel = watch("personnel");
  const totalHours = watch("totalHours");
  
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
      try {
        const calculatedTotalHours = calculateTotalHours(
          departureTime,
          arrivalTime,
          endTime,
          breakTimeValue,
          selectedPersonnel.length
        );
        
        setValue('totalHours', calculatedTotalHours);
      } catch (error) {
        console.error("Error calculating total hours:", error);
      }
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
    
    const totalHoursCompleted = projectWorkLogs.reduce((sum, log) => {
      return sum + (log.timeTracking?.totalHours || 0);
    }, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    const difference = (project.visitDuration || 0) - averageHoursPerVisit;
    
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
  
  return (
    <FormProvider {...form}>
      <WorkLogFormProvider
        form={form}
        initialData={initialData}
        projectInfos={projectInfos}
        existingWorkLogs={existingWorkLogs}
        selectedProject={selectedProject}
        timeDeviation={timeDeviation}
        timeDeviationClass={timeDeviationClass}
      >
        <WorkLogFormSubmitHandler onSuccess={onSuccess}>
          <HeaderSection 
            teams={teams}
            filteredProjects={filteredProjects}
            handleTeamFilterChange={handleTeamFilterChange}
            handlePersonnelChange={handlePersonnelChange}
          />
          
          <Separator />
          
          <TimeTrackingSection />
          
          <Separator />
          
          <TasksSection />
          
          <ProjectInfoSection />
          
          <NotesSection />
          
          <ActionButtons 
            onCancel={handleCancel}
            isEditing={!!initialData}
          />
        </WorkLogFormSubmitHandler>
      </WorkLogFormProvider>
    </FormProvider>
  );
};

export default WorkLogForm;
