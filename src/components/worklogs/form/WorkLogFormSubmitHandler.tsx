
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { WorkLog, Consumable } from '@/types/models';
import { createWorkLogFromFormData } from './utils/formatWorksheetData';
import { generateSequentialWorkLogId, generateUniqueBlankSheetId } from '../../worksheets/form/utils/generateUniqueIds';

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
      
      // Ensure consumables conform to required Consumable type
      const validatedConsumables: Consumable[] = (formData.consumables || []).map(item => ({
        id: item.id || crypto.randomUUID(),
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity || 0),
        unitPrice: Number(item.unitPrice || 0),
        totalPrice: Number(item.totalPrice || 0)
      }));
      
      // Create a WorkLog object from form data
      const workLogData = createWorkLogFromFormData(
        formData,
        existingWorkLogId,
        workLogs,
        formData.notes || '',
        validatedConsumables
      );
      
      // Generate appropriate ID based on worksheet type
      if (!existingWorkLogId) {
        if (isBlankWorksheet) {
          workLogData.projectId = generateUniqueBlankSheetId(workLogs);
          workLogData.isBlankWorksheet = true;
        } else {
          workLogData.projectId = generateSequentialWorkLogId(workLogs);
          workLogData.isBlankWorksheet = false;
        }
      }
      
      // Save or update the work log
      if (existingWorkLogId) {
        await updateWorkLog(workLogData);
      } else {
        await addWorkLog(workLogData);
      }
      
      toast.success("Fiche enregistrée avec succès");
      
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
