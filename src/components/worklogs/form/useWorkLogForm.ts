
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { formSchema, FormValues } from './schema';
import { ProjectInfo, WorkLog } from '@/types/models';
import { calculateTotalHours } from '@/utils/time';

interface UseWorkLogFormProps {
  initialData?: WorkLog;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

export const useWorkLogFormState = ({
  initialData,
  projectInfos,
  existingWorkLogs
}: UseWorkLogFormProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const [timeDeviation, setTimeDeviation] = useState<string>("N/A");
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>("");
  const navigate = useNavigate();
  
  // Prepare default values for the form
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
  
  // Effect to filter projects by team
  useEffect(() => {
    if (teamFilter) {
      const filtered = projectInfos.filter(p => p.team === teamFilter);
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projectInfos);
    }
  }, [teamFilter, projectInfos]);
  
  // Effect to update selected project and calculate time deviation
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
  
  // Effect to update time deviation when total hours changes
  useEffect(() => {
    if (selectedProject && totalHours) {
      calculateTimeDeviation(selectedProject);
    }
  }, [totalHours, selectedProject]);
  
  // Effect to calculate total hours based on time inputs
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

  return {
    form,
    selectedProject,
    filteredProjects,
    timeDeviation,
    timeDeviationClass,
    handlePersonnelChange,
    handleTeamFilterChange,
    handleCancel
  };
};
