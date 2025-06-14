
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { WorkLog, Consumable } from '@/types/models';
import { formatStructuredNotes, validateConsumables } from './utils/formatWorksheetData';
import { generateUniqueBlankSheetId } from './utils/generateUniqueIds';

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
  isBlankWorksheet = true
}) => {
  const methods = useFormContext<BlankWorkSheetValues>();
  const { addWorkLog, updateWorkLog, workLogs } = useWorkLogs();
  const { getCurrentUser } = useApp();
  
  const handleFormSubmit = async (formData: BlankWorkSheetValues) => {
    try {
      console.log('Blank worksheet form submitted:', formData);
      
      if (!formData.personnel || formData.personnel.length === 0) {
        toast.error("Veuillez sélectionner au moins une personne");
        return;
      }
      
      // Récupérer l'utilisateur actuel
      const currentUser = getCurrentUser();
      const currentUserName = currentUser ? (currentUser.name || currentUser.username) : 'Utilisateur inconnu';
      
      // Format data for storage
      const structuredNotes = formatStructuredNotes(formData);
      const validatedConsumables = validateConsumables(formData.consumables || []);
      
      // Create the workLog object
      const workLog: WorkLog = {
        id: existingWorkLogId || crypto.randomUUID(),
        projectId: existingWorkLogId ? '' : generateUniqueBlankSheetId(workLogs),
        date: formData.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        personnel: formData.personnel,
        timeTracking: {
          departure: formData.departure || '',
          arrival: formData.arrival || '',
          end: formData.end || '',
          breakTime: formData.breakTime || '',
          totalHours: Number(formData.totalHours) || 0
        },
        duration: 0,
        waterConsumption: 0,
        wasteManagement: formData.wasteManagement || 'none',
        tasks: '',
        notes: structuredNotes,
        consumables: validatedConsumables,
        invoiced: Boolean(formData.invoiced),
        isArchived: false,
        tasksPerformed: {
          watering: 'none',
          customTasks: {},
          tasksProgress: {}
        },
        isBlankWorksheet: true,
        createdAt: new Date(),
        createdBy: currentUserName,
        hourlyRate: formData.hourlyRate,
        signedQuoteAmount: formData.signedQuoteAmount,
        isQuoteSigned: formData.isQuoteSigned,
        clientName: formData.clientName,
        address: formData.address,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        clientSignature: formData.clientSignature
      };
      
      console.log('WorkLog data before submission:', workLog);
      
      // Vérifier si c'est une mise à jour ou une création
      if (existingWorkLogId) {
        await updateWorkLog(workLog);
        toast.success("Fiche vierge mise à jour avec succès");
      } else {
        const result = await addWorkLog(workLog);
        console.log('Add result:', result);
        toast.success("Fiche vierge enregistrée avec succès");
      }
      
      // Call the success callback if provided
      if (onSuccess) {
        console.log('Calling onSuccess callback for blank worksheet');
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Erreur lors de l'enregistrement de la fiche vierge: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
