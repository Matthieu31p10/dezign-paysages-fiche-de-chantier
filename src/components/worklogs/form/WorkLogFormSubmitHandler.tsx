import React, { ReactNode } from 'react';
import { useWorkLogForm } from './WorkLogFormContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createWorkLogFromFormData, formatStructuredNotes, validateConsumables } from './utils/formatWorksheetData';
import { useApp } from '@/context/AppContext';

interface WorkLogFormSubmitHandlerProps {
  children: ReactNode;
  onSuccess?: () => void;
  existingWorkLogId?: string;
  isBlankWorksheet?: boolean;
}

const WorkLogFormSubmitHandler: React.FC<WorkLogFormSubmitHandlerProps> = ({
  children,
  onSuccess,
  existingWorkLogId,
  isBlankWorksheet = false
}) => {
  const { form, existingWorkLogs } = useWorkLogForm();
  const { addWorkLog, updateWorkLog } = useWorkLogs();
  const { getCurrentUser } = useApp();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      console.log('Submitting form data:', data);
      
      // Validate required fields for work logs (not blank worksheets)
      if (!isBlankWorksheet && !data.projectId) {
        toast.error('Veuillez sélectionner un projet');
        return;
      }

      // Format structured notes
      const structuredNotes = formatStructuredNotes(data);
      
      // Validate consumables
      const validatedConsumables = validateConsumables(data.consumables || []);
      
      // Get current user
      const currentUser = getCurrentUser();
      
      // Create work log object
      const workLogData = createWorkLogFromFormData(
        data,
        existingWorkLogId,
        existingWorkLogs,
        structuredNotes,
        validatedConsumables,
        currentUser?.name
      );

      console.log('Final workLog data:', workLogData);
      
      if (existingWorkLogId) {
        // Update existing work log
        await updateWorkLog(workLogData);
        toast.success('Fiche de suivi modifiée avec succès');
      } else {
        // Create new work log
        await addWorkLog(workLogData);
        toast.success('Fiche de suivi créée avec succès');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/worklogs');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la fiche');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
