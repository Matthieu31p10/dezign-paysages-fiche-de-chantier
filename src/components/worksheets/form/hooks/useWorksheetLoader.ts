
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { WorkLog } from '@/types/models';
import { 
  extractClientName,
  extractAddress, 
  extractContactPhone, 
  extractContactEmail, 
  extractDescription,
  extractHourlyRate,
  extractVatRate,
  extractSignedQuote,
  extractLinkedProjectId,
  extractQuoteValue
} from '@/utils/helpers';

type UseWorksheetLoaderProps = {
  form: UseFormReturn<BlankWorkSheetValues>;
  getWorkLogById: (id: string) => WorkLog | undefined;
  handleProjectSelect: (projectId: string) => void;
};

/**
 * Hook to handle loading worksheet data for editing
 */
export const useWorksheetLoader = ({ 
  form, 
  getWorkLogById, 
  handleProjectSelect 
}: UseWorksheetLoaderProps) => {
  
  const loadWorkLogData = useCallback((id: string) => {
    const workLog = getWorkLogById(id);
    if (!workLog) return;
    
    // Extract all data from the worklog
    const clientName = extractClientName(workLog.notes || '');
    const address = extractAddress(workLog.notes || '');
    const contactPhone = extractContactPhone(workLog.notes || '');
    const contactEmail = extractContactEmail(workLog.notes || '');
    const notes = extractDescription(workLog.notes || '');
    const hourlyRate = extractHourlyRate(workLog.notes || '');
    const vatRateValue = extractVatRate(workLog.notes || '');
    const signedQuote = extractSignedQuote(workLog.notes || '');
    const linkedProjectId = extractLinkedProjectId(workLog.notes || '');
    const quoteValue = extractQuoteValue(workLog.notes || '');
    
    console.log("Chargement des données pour édition:", {
      clientName,
      address,
      contactPhone,
      contactEmail,
      hourlyRate,
      vatRateValue,
      signedQuote, 
      quoteValue,
      linkedProjectId
    });
    
    // Ensure vatRate is either "10" or "20"
    const vatRate = vatRateValue === "10" ? "10" : "20";
    
    form.reset({
      clientName,
      address,
      contactPhone,
      contactEmail,
      date: new Date(workLog.date),
      personnel: workLog.personnel || [],
      departure: workLog.timeTracking?.departure || '08:00',
      arrival: workLog.timeTracking?.arrival || '08:30',
      end: workLog.timeTracking?.end || '16:30',
      breakTime: workLog.timeTracking?.breakTime || '00:30',
      totalHours: workLog.timeTracking?.totalHours || 7.5,
      hourlyRate: Number(hourlyRate) || 0,
      wasteManagement: workLog.wasteManagement || 'none',
      teamFilter: 'all',
      linkedProjectId: linkedProjectId || '',
      notes: notes || '',
      tasks: workLog.tasks || '',
      consumables: workLog.consumables || [],
      vatRate,
      signedQuote: signedQuote || false,
      quoteValue: Number(quoteValue) || 0,
      clientSignature: workLog.clientSignature || '',
    });
    
    if (linkedProjectId) {
      handleProjectSelect(linkedProjectId);
    }
  }, [form, getWorkLogById, handleProjectSelect]);
  
  return { loadWorkLogData };
};
