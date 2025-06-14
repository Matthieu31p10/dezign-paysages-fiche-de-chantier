
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { toast } from 'sonner';

interface UseFormActionsProps {
  form: UseFormReturn<BlankWorkSheetValues>;
  workLogId?: string | null;
  onSuccess?: () => void;
  workLogs?: WorkLog[];
  handleClearProject: () => void;
}

export const useFormActions = ({
  form,
  workLogId,
  onSuccess,
  workLogs = [],
  handleClearProject
}: UseFormActionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addWorkLog, updateWorkLog } = useWorkLogs();
  
  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      
      if (workLogId) {
        // Update existing worksheet
        if (onSuccess) onSuccess();
      } else {
        // Create new worksheet
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erreur lors de la soumission du formulaire');
    } finally {
      setIsSubmitting(false);
    }
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
