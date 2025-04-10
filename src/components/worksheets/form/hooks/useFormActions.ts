
import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { submitWorksheetForm } from '../submitWorksheetForm';
import { WorkLog } from '@/types/models';

type UseFormActionsProps = {
  form: UseFormReturn<BlankWorkSheetValues>;
  addWorkLog: (workLog: WorkLog) => Promise<void>;
  updateWorkLog: (workLog: WorkLog) => Promise<void>;
  workLogId?: string | null;
  onSuccess?: () => void;
  workLogs?: WorkLog[];
  handleClearProject: () => void;
};

/**
 * Hook to handle form actions like submit, reset, and filters
 */
export const useFormActions = ({
  form,
  addWorkLog,
  updateWorkLog,
  workLogId,
  onSuccess,
  workLogs,
  handleClearProject
}: UseFormActionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    handleClearProject();
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
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleTeamFilterChange,
    handlePersonnelChange,
    handleCancel,
    resetForm
  };
};
