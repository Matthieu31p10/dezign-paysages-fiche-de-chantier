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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      projectId: initialData.projectId,
      date: new Date(initialData.date),
      duration: initialData.duration || 0,
      personnel: initialData.personnel || [],
      departure: initialData.timeTracking?.departure || '',
      arrival: initialData.timeTracking?.arrival || '',
      end: initialData.timeTracking?.end || '',
      breakTime: initialData.timeTracking?.breakTime || '',
      totalHours: initialData.timeTracking?.totalHours || 0,
      notes: initialData.notes || '',
      waterConsumption: initialData.waterConsumption || 0,
      teamFilter: "",
      watering: initialData.tasksPerformed?.watering || 'none',
      customTasks: initialData.tasksPerformed?.customTasks || {},
      tasksProgress: initialData.tasksPerformed?.tasksProgress || {},
      wasteManagement: (initialData.wasteManagement as 'none' | 'keep' | 'remove') || 'none',
      consumables: initialData.consumables || [],
      invoiced: initialData.invoiced || false,
    } : {
      teamFilter: "",
      watering: 'none',
      customTasks: {},
      tasksProgress: {},
      wasteManagement: 'none',
      consumables: [],
      invoiced: false,
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
