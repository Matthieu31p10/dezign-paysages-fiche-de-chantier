
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { WorkLog } from '@/types/models';
import { createWorkLogFromFormData, formatStructuredNotes, validateConsumables } from './utils/formatWorksheetData';

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
  const { getCurrentUser } = useApp();
  
  const handleFormSubmit = async (formData: FormValues) => {
    try {
      console.log('Form submitted with data:', formData);
      console.log('Waste management value:', formData.wasteManagement);
      
      // Validation de base
      if (!isBlankWorksheet && !formData.projectId) {
        toast.error("Veuillez sélectionner un projet");
        return;
      }
      
      if (!formData.personnel || formData.personnel.length === 0) {
        toast.error("Veuillez sélectionner au moins une personne");
        return;
      }
      
      // Récupérer l'utilisateur actuel
      const currentUser = getCurrentUser();
      const currentUserName = currentUser ? (currentUser.name || currentUser.username) : 'Utilisateur inconnu';
      
      // Préparation des données pour WorkLog
      const workLogData: WorkLog = {
        id: existingWorkLogId || crypto.randomUUID(),
        projectId: formData.projectId,
        date: formData.date.toISOString().split('T')[0],
        personnel: formData.personnel,
        timeTracking: {
          departure: formData.departure || '',
          arrival: formData.arrival || '',
          end: formData.end || '',
          breakTime: formData.breakTime || '',
          totalHours: formData.totalHours || 0
        },
        duration: formData.duration || 0,
        waterConsumption: formData.waterConsumption || 0,
        wasteManagement: formData.wasteManagement || 'none',
        tasks: formData.tasks || '',
        notes: formData.notes || '',
        consumables: formData.consumables || [],
        invoiced: formData.invoiced || false,
        isArchived: false,
        tasksPerformed: {
          watering: formData.watering || 'none',
          customTasks: formData.customTasks || {},
          tasksProgress: formData.tasksProgress || {}
        },
        isBlankWorksheet: isBlankWorksheet,
        createdAt: new Date(),
        createdBy: currentUserName
      };
      
      console.log('WorkLog data before submission:', workLogData);
      
      // Soumission des données
      if (existingWorkLogId) {
        await updateWorkLog(workLogData);
        toast.success(`Fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'} mise à jour avec succès`);
      } else {
        console.log('Adding new worklog:', workLogData);
        const result = await addWorkLog(workLogData);
        console.log('Added worklog result:', result);
        toast.success(`Fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'} enregistrée avec succès`);
      }
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="w-full">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
