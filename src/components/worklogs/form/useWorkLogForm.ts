
import { useForm } from 'react-hook-form';
import { FormValues, formSchema } from './schema';
import { WorkLog, ProjectInfo } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectSelection } from './hooks/useProjectSelection';
import { useTimeDeviation } from './hooks/useTimeDeviation';
import { useWorkLogPersonnel } from './hooks/useWorkLogPersonnel';
import { useWorkLogNavigation } from './hooks/useWorkLogNavigation';

interface UseWorkLogFormStateProps {
  initialData?: WorkLog;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

export const useWorkLogFormState = ({ 
  initialData, 
  projectInfos,
  existingWorkLogs
}: UseWorkLogFormStateProps) => {
  // Récupérer le dernier projet utilisé si pas de données initiales
  const getLastUsedProject = () => {
    if (initialData?.projectId) return initialData.projectId;
    const stored = localStorage.getItem('lastUsedProjectId');
    return stored || '';
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      projectId: initialData.projectId || '',
      date: new Date(initialData.date),
      duration: initialData.duration !== undefined ? initialData.duration : 0,
      personnel: initialData.personnel || [],
      departure: initialData.timeTracking?.departure || '',
      arrival: initialData.timeTracking?.arrival || '',
      end: initialData.timeTracking?.end || '',
      breakTime: initialData.timeTracking?.breakTime || '',
      totalHours: initialData.timeTracking?.totalHours !== undefined ? initialData.timeTracking.totalHours : 0,
      notes: initialData.notes || '',
      waterConsumption: initialData.waterConsumption !== undefined ? initialData.waterConsumption : 0,
      teamFilter: "all",
      watering: initialData.tasksPerformed?.watering || 'none',
      customTasks: initialData.tasksPerformed?.customTasks || {},
      tasksProgress: initialData.tasksPerformed?.tasksProgress || {},
      wasteManagement: (initialData.wasteManagement as 'none' | 'keep' | 'remove') || 'none',
      consumables: initialData.consumables || [],
      invoiced: initialData.invoiced || false,
    } : {
      projectId: getLastUsedProject(),
      date: new Date(),
      personnel: [],
      teamFilter: "all",
      watering: 'none',
      customTasks: {},
      tasksProgress: {},
      wasteManagement: 'none',
      consumables: [],
      invoiced: false,
      duration: 0,
      totalHours: 0,
      waterConsumption: 0,
      departure: '',
      arrival: '',
      end: '',
      breakTime: '',
      notes: '',
    }
  });

  const { 
    selectedProject,
    filteredProjects,
    previousYearsHours,
    currentYearTarget,
    handleTeamFilterChange
  } = useProjectSelection({ form, projectInfos, existingWorkLogs });

  const { timeDeviation, timeDeviationClass } = useTimeDeviation({
    form, 
    selectedProject, 
    existingWorkLogs
  });

  const { handlePersonnelChange } = useWorkLogPersonnel({ 
    form,
    initialSelectedPersonnel: initialData?.personnel
  });
  
  const { handleCancel } = useWorkLogNavigation();
  
  return {
    form,
    selectedProject,
    filteredProjects,
    timeDeviation,
    timeDeviationClass,
    handlePersonnelChange,
    handleTeamFilterChange,
    handleCancel,
    previousYearsHours,
    currentYearTarget
  };
};
