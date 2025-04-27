
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { WorkLog, Consumable } from '@/types/models';
import { createWorkLogFromFormData } from './utils/formatWorksheetData';
import { generateUniqueBlankSheetId, isBlankWorksheet } from '../../worksheets/form/utils/generateUniqueIds';

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
  const methods = useFormContext<FormValues>();
  const { addWorkLog, updateWorkLog, workLogs } = useWorkLogs();
  
  const handleFormSubmit = async (formData: FormValues) => {
    try {
      console.log('Form submitted:', formData);
      
      if (!formData.projectId && !isBlankWorksheet) {
        toast.error("Veuillez sélectionner un projet");
        return;
      }
      
      if (!formData.personnel || formData.personnel.length === 0) {
        toast.error("Veuillez sélectionner au moins une personne");
        return;
      }
      
      // Ensure consumables conform to required Consumable type
      const validatedConsumables: Consumable[] = (formData.consumables || []).map(item => ({
        id: item.id || crypto.randomUUID(),
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      }));
      
      // Créer un objet WorkLog à partir des données de formulaire
      const workLogData = createWorkLogFromFormData(
        formData,
        existingWorkLogId,
        workLogs,
        formData.notes || '',
        validatedConsumables
      );
      
      // For blank worksheets, ensure we use the DZFV ID format
      if (isBlankWorksheet && !existingWorkLogId) {
        workLogData.projectId = generateUniqueBlankSheetId(workLogs);
        workLogData.isBlankWorksheet = true;
      }
      
      console.log('WorkLog data before submission:', workLogData);
      
      // Vérifier si c'est une mise à jour ou une création
      if (existingWorkLogId) {
        await updateWorkLog(workLogData);
        toast.success("Fiche mise à jour avec succès");
      } else {
        await addWorkLog(workLogData);
        toast.success("Fiche enregistrée avec succès");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
