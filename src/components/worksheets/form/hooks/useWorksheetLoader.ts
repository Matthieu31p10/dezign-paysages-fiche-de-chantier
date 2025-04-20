
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { WorkLog } from '@/types/models';
import { useEffect } from 'react';

interface UseWorksheetLoaderProps {
  form: UseFormReturn<BlankWorkSheetValues>;
  getWorkLogById: (id: string) => WorkLog | undefined;
  handleProjectSelect: (projectId: string | null) => void;
}

export const useWorksheetLoader = ({
  form,
  getWorkLogById,
  handleProjectSelect
}: UseWorksheetLoaderProps) => {
  
  // Load work log data into the form
  const loadWorkLogData = (workLogId: string) => {
    if (!workLogId) return;
    
    const workLog = getWorkLogById(workLogId);
    if (!workLog) {
      console.error(`Work log with ID ${workLogId} not found`);
      return;
    }
    
    console.log("Loading work log data:", workLog);
    
    // Set common fields
    form.reset({
      id: workLog.id,
      clientName: workLog.clientName || '',
      address: workLog.address || '',
      contactPhone: workLog.contactPhone || '',
      contactEmail: workLog.contactEmail || '',
      date: workLog.date ? new Date(workLog.date) : new Date(),
      personnel: workLog.personnel || [],
      departure: workLog.timeTracking?.departure || '',
      arrival: workLog.timeTracking?.arrival || '',
      end: workLog.timeTracking?.end || '',
      breakTime: workLog.timeTracking?.breakTime || '',
      totalHours: workLog.timeTracking?.totalHours || 0,
      tasks: workLog.tasks || '',
      wasteManagement: workLog.wasteManagement || 'none',
      notes: workLog.notes || '',
      clientSignature: workLog.clientSignature || null,
      consumables: workLog.consumables || [],
      hourlyRate: workLog.hourlyRate || 0,
      signedQuoteAmount: workLog.signedQuoteAmount || 0,
      isQuoteSigned: workLog.isQuoteSigned || false,
      linkedProjectId: workLog.linkedProjectId || null,
      teamFilter: 'all'
    });
    
    // If there's a linked project, select it
    if (workLog.linkedProjectId) {
      handleProjectSelect(workLog.linkedProjectId);
    }
    
    console.log("Form data loaded:", form.getValues());
  };
  
  return {
    loadWorkLogData
  };
};
