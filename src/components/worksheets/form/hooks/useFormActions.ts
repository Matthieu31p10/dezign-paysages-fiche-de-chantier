
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { submitWorksheetForm } from '../submitWorksheetForm';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';

interface UseFormActionsProps {
  form: UseFormReturn<BlankWorkSheetValues>;
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (workLog: WorkLog) => Promise<void>;
  workLogId?: string | null;
  onSuccess?: () => void;
  workLogs?: WorkLog[];
  handleClearProject: () => void;
}

export const useFormActions = ({
  form,
  addWorkLog,
  updateWorkLog,
  workLogId,
  onSuccess,
  workLogs = [],
  handleClearProject
}: UseFormActionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    // Submit the form data
    await submitWorksheetForm({
      data,
      addWorkLog,
      updateWorkLog,
      existingWorkLogId: workLogId,
      onSuccess,
      setIsSubmitting,
      workLogs
    });
  });
  
  // Handle form cancellation
  const handleCancel = () => {
    form.reset();
    handleClearProject();
    navigate(-1);
  };
  
  return {
    isSubmitting,
    handleSubmit,
    handleCancel
  };
};
