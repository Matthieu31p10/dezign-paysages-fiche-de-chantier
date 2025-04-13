
import { useForm } from 'react-hook-form';
import { BlankWorkSheetValues, BlankWorkSheetSchema } from '../schema';
import { useEffect, useState } from 'react';
import { useTimeCalculation } from './hooks/useTimeCalculation';
import { useWorksheetLoader } from './hooks/useWorksheetLoader';
import { useFormActions } from './hooks/useFormActions';
import { WorkLog } from '@/types/models';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialData?.linkedProjectId || null
  );
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { addWorkLog, updateWorkLog } = useWorkLogs();
  
  // Initialize the form with default values and validation
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(BlankWorkSheetSchema),
    defaultValues: {
      clientName: initialData?.clientName || '',
      address: initialData?.address || '',
      contactPhone: initialData?.contactPhone || '',
      contactEmail: initialData?.contactEmail || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      personnel: initialData?.personnel || [],
      departure: initialData?.timeTracking?.departure || '',
      arrival: initialData?.timeTracking?.arrival || '',
      end: initialData?.timeTracking?.end || '',
      breakTime: initialData?.timeTracking?.breakTime || '',
      tasks: initialData?.tasks || '',
      wasteManagement: initialData?.wasteManagement || 'none',
      notes: initialData?.notes || '',
      clientSignature: initialData?.clientSignature || null,
      consumables: initialData?.consumables || [],
      totalHours: initialData?.totalHours || 0,
      hourlyRate: initialData?.hourlyRate || 0,
      signedQuoteAmount: initialData?.signedQuoteAmount || 0,
      isQuoteSigned: initialData?.isQuoteSigned || false,
      linkedProjectId: initialData?.linkedProjectId || null,
      teamFilter: initialData?.teamFilter || 'all'
    }
  });
  
  // Handle time calculations
  useTimeCalculation(form);
  
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
      form.setValue('contactPhone', project.contact?.phone || '');
      form.setValue('contactEmail', project.contact?.email || '');
    }
  };
  
  const handleClearProject = () => {
    setSelectedProjectId(null);
    setSelectedProject(null);
  };
  
  // Handle worklog data loading
  const { loadWorkLogData } = useWorksheetLoader({
    form,
    getWorkLogById: (id: string) => workLogs.find(wl => wl.id === id),
    handleProjectSelect
  });
  
  // Load the linked project if it exists
  useEffect(() => {
    if (initialData?.linkedProjectId) {
      handleProjectSelect(initialData.linkedProjectId);
    }
  }, [initialData?.linkedProjectId]);
  
  // Calculate total hours
  const calculateTotalHours = () => {
    const departure = form.watch('departure');
    const arrival = form.watch('arrival');
    const end = form.watch('end');
    const breakTime = form.watch('breakTime');
    
    // Logic to calculate hours based on these values
    console.log("Calculating hours based on:", departure, arrival, end, breakTime);
    // We'll let the useTimeCalculation hook handle the actual calculation
  };
  
  // Handle form submission and cancellation
  const formActions = useFormActions({
    form,
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
