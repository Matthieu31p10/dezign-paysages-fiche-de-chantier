
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { WorkLog, Consumable } from '@/types/models';
import { createWorkLogFromFormData } from './utils/formatWorksheetData';

interface WorkLogFormSubmitHandlerProps {
  children: React.ReactNode;
  onSuccess?: () => void;
  existingWorkLogId?: string | null;
}

const WorkLogFormSubmitHandler: React.FC<WorkLogFormSubmitHandlerProps> = ({ 
  children, 
  onSuccess,
  existingWorkLogId
}) => {
  const methods = useFormContext<BlankWorkSheetValues>();
  const { addWorkLog, updateWorkLog, workLogs } = useWorkLogs();
  
  const handleFormSubmit = async (formData: BlankWorkSheetValues) => {
    try {
      console.log('Form submitted:', formData);
      
      // Ensure consumables conform to required Consumable type
      const validatedConsumables: Consumable[] = (formData.consumables || []).map(item => ({
        id: item.id || crypto.randomUUID(),
        supplier: item.supplier || '',  // Ensure required field has default value
        product: item.product || '',
        unit: item.unit || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        totalPrice: item.totalPrice || 0
      }));
      
      // Créer un objet WorkLog à partir des données de formulaire
      const workLogData = createWorkLogFromFormData(
        formData,
        existingWorkLogId,
        workLogs,
        formData.notes || '',
        validatedConsumables
      );
      
      // Vérifier si c'est une mise à jour ou une création
      if (existingWorkLogId) {
        await updateWorkLog(workLogData);
      } else {
        await addWorkLog(workLogData);
      }
      
      toast.success("Fiche de suivi enregistrée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erreur lors de l'enregistrement de la fiche");
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
