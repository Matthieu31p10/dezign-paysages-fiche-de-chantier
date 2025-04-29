
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { WorkLog, Consumable } from '@/types/models';
import { createWorkLogFromFormData, formatStructuredNotes, validateConsumables } from './utils/formatWorksheetData';
import { generateUniqueBlankSheetId, isBlankWorksheet } from './utils/generateUniqueIds';

interface WorkLogFormSubmitHandlerProps {
  children: React.ReactNode;
  onSuccess?: () => void;
  existingWorkLogId?: string | null;
  isBlankWorksheet?: boolean;
}

const WorkLogFormSubmitHandler: React.FC<WorkLogFormSubmitHandlerProps> = ({ 
  children, 
  onSuccess,
  existingWorkLogId,
  isBlankWorksheet = false
}) => {
  const methods = useFormContext<BlankWorkSheetValues>();
  const { addWorkLog, updateWorkLog, workLogs } = useWorkLogs();
  
  const handleFormSubmit = async (formData: BlankWorkSheetValues) => {
    try {
      console.log('Blank worksheet form submitted:', formData);
      
      if (!formData.personnel || formData.personnel.length === 0) {
        toast.error("Veuillez sélectionner au moins une personne");
        return;
      }
      
      // Format data for storage
      const structuredNotes = formatStructuredNotes(formData);
      const validatedConsumables = validateConsumables(formData.consumables);
      
      // Create the workLog object
      const workLog = createWorkLogFromFormData(
        formData, 
        existingWorkLogId, 
        workLogs, 
        structuredNotes, 
        validatedConsumables
      );
      
      // For new blank worksheets, ensure we use the DZFV sequential ID
      if (!existingWorkLogId) {
        workLog.isBlankWorksheet = true;
      }
      
      // Always ensure createdAt is a Date object
      workLog.createdAt = new Date();
      
      console.log('WorkLog data before submission:', workLog);
      
      // Vérifier si c'est une mise à jour ou une création
      if (existingWorkLogId) {
        await updateWorkLog(workLog);
        toast.success("Fiche mise à jour avec succès");
      } else {
        const result = await addWorkLog(workLog);
        console.log('Add result:', result);
        toast.success("Fiche vierge enregistrée avec succès");
      }
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Erreur lors de l'enregistrement de la fiche: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
