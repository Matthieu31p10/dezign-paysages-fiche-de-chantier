
import { useForm } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { useEffect, useState } from 'react';
import { useFormInitialization } from './hooks/useFormInitialization';
import { useTimeCalculation } from './hooks/useTimeCalculation';
import { useWorksheetLoader } from './hooks/useWorksheetLoader';
import { useFormActions } from './hooks/useFormActions';
import { WorkLog } from '@/types/models';

interface UseBlankWorksheetFormProps {
  initialData?: any;
  onSuccess?: () => void;
  workLogs?: WorkLog[];
  projectInfos?: any[];
}

export const useBlankWorksheetForm = ({
  initialData,
  onSuccess,
  workLogs = [],
  projectInfos = []
}: UseBlankWorksheetFormProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  // Initialize the form with default values
  const form = useForm<BlankWorkSheetValues>({
    defaultValues: {
      clientName: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      date: new Date().toISOString().split('T')[0],
      personnel: [],
      departure: '',
      arrival: '',
      end: '',
      breakTime: '',
      selectedTasks: [],
      tasksProgress: {},
      wasteManagement: 'none',
      notes: '',
      clientSignature: null,
      consumables: [],
    }
  });
  
  // Handle form initialization
  const { resetForm } = useFormInitialization({
    form,
    initialData,
    selectedProject
  });
  
  // Handle time calculations
  const { calculateTotalHours } = useTimeCalculation({ form });
  
  // Handle worklog data loading
  const { loadWorkLogData } = useWorksheetLoader({
    form,
    resetForm,
    setSelectedProjectId,
    setSelectedProject,
    workLogs
  });

  // Handle project linking
  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    
    if (!projectId) {
      setSelectedProject(null);
      return;
    }
    
    const project = projectInfos.find(p => p.id === projectId);
    setSelectedProject(project || null);
    
    if (project) {
      form.setValue('clientName', project.clientName || project.name);
      form.setValue('address', project.address);
      form.setValue('contactName', project.contact?.name || '');
      form.setValue('contactPhone', project.contact?.phone || '');
      form.setValue('contactEmail', project.contact?.email || '');
    }
  };
  
  const handleClearProject = () => {
    setSelectedProjectId(null);
    setSelectedProject(null);
  };
  
  // Handle form submission and cancellation
  const formActions = useFormActions({
    form,
    addWorkLog: async (workLog: WorkLog) => {
      // Adapt to the Promise-based API
      try {
        return await addWorkLog(workLog);
      } catch (error) {
        console.error("Error adding work log", error);
        throw error;
      }
    },
    updateWorkLog: async (workLog: WorkLog) => {
      try {
        await updateWorkLog(workLog);
      } catch (error) {
        console.error("Error updating work log", error);
        throw error;
      }
    },
    workLogId: initialData?.id,
    onSuccess,
    workLogs,
    handleClearProject
  });
  
  return {
    form,
    loadWorkLogData,
    selectedProjectId,
    selectedProject,
    handleProjectSelect,
    handleClearProject,
    calculateTotalHours,
    ...formActions,
  };
};

// Placeholder functions to make TypeScript happy - these will be provided at runtime
const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
  console.log('Adding work log...', workLog);
  return Promise.resolve(workLog);
};

const updateWorkLog = async (workLog: WorkLog): Promise<void> => {
  console.log('Updating work log...', workLog);
  return Promise.resolve();
};
