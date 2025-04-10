import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blankWorkSheetSchema, BlankWorkSheetValues } from '../schema';
import { useState, useEffect, useCallback } from 'react';
import { calculateTotalHours } from '@/utils/time';
import { useApp } from '@/context/AppContext';
import { useProjectLink } from './useProjectLinkHook';
import { submitWorksheetForm } from './submitWorksheetForm';
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

export const useBlankWorksheetForm = (
  onSuccess?: () => void, 
  workLogId?: string | null, 
  workLogs?: WorkLog[]
) => {
  const { addWorkLog, updateWorkLog, getWorkLogById } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(blankWorkSheetSchema),
    defaultValues: {
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      notes: '',
      tasks: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
      quoteValue: 0,
      clientSignature: '',
    }
  });
  
  const projectLinkHook = useProjectLink(form);
  
  useEffect(() => {
    const departureTime = form.watch("departure");
    const arrivalTime = form.watch("arrival");
    const endTime = form.watch("end");
    const breakTimeValue = form.watch("breakTime");
    const selectedPersonnel = form.watch("personnel");
    
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      try {
        const calculatedTotalHours = calculateTotalHours(
          departureTime,
          arrivalTime,
          endTime,
          breakTimeValue,
          selectedPersonnel.length
        );
        
        form.setValue('totalHours', Number(calculatedTotalHours));
      } catch (error) {
        console.error("Error calculating total hours:", error);
      }
    }
  }, [
    form.watch("departure"), 
    form.watch("arrival"), 
    form.watch("end"), 
    form.watch("breakTime"), 
    form.watch("personnel").length, 
    form
  ]);
  
  const loadWorkLogData = useCallback((id: string) => {
    const workLog = getWorkLogById(id);
    if (!workLog) return;
    
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
      hourlyRate,
      vatRateValue,
      signedQuote, 
      quoteValue
    });
    
    // Ensure vatRate is either "10" or "20"
    const vatRate = vatRateValue === "10" ? "10" : "20";
    
    form.reset({
      clientName,
      address,
      contactPhone,
      contactEmail,
      date: new Date(workLog.date),
      personnel: workLog.personnel,
      departure: workLog.timeTracking.departure || '08:00',
      arrival: workLog.timeTracking.arrival || '08:30',
      end: workLog.timeTracking.end || '16:30',
      breakTime: workLog.timeTracking.breakTime || '00:30',
      totalHours: workLog.timeTracking.totalHours || 7.5,
      hourlyRate: Number(hourlyRate) || 0,
      wasteManagement: workLog.wasteManagement || 'none',
      teamFilter: 'all',
      linkedProjectId: linkedProjectId || '',
      notes: notes || '',
      tasks: workLog.tasks || '',
      consumables: workLog.consumables || [],
      vatRate,  // Use the corrected value
      signedQuote: signedQuote || false,
      quoteValue: Number(quoteValue) || 0,
      clientSignature: workLog.clientSignature || '',
    });
    
    if (linkedProjectId) {
      projectLinkHook.handleProjectSelect(linkedProjectId);
    }
  }, [form, getWorkLogById, projectLinkHook]);
  
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    await submitWorksheetForm({
      data,
      addWorkLog,
      updateWorkLog,
      existingWorkLogId: workLogId,
      onSuccess,
      setIsSubmitting,
      workLogs
    });
  };
  
  const resetForm = () => {
    form.reset({
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      notes: '',
      tasks: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
      quoteValue: 0,
      clientSignature: '',
    });
    
    projectLinkHook.handleClearProject();
  };
  
  const handleTeamFilterChange = (value: string) => {
    form.setValue('teamFilter', value);
  };
  
  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    form.setValue('personnel', selectedPersonnel);
  };
  
  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };
  
  return {
    form,
    isSubmitting,
    ...projectLinkHook,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleTeamFilterChange,
    handlePersonnelChange,
    handleCancel,
    resetForm,
    loadWorkLogData
  };
};
