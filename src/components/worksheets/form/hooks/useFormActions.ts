
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

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
  const { getCurrentUser } = useApp();
  
  // Handle form submission
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    console.log('Form submission started with data:', data);
    
    try {
      setIsSubmitting(true);
      
      // Validation de base
      if (!data.personnel || data.personnel.length === 0) {
        toast.error("Veuillez sélectionner au moins une personne");
        return;
      }
      
      // Récupérer l'utilisateur actuel
      const currentUser = getCurrentUser();
      const currentUserName = currentUser ? (currentUser.name || currentUser.username) : 'Utilisateur inconnu';
      
      // Préparation des données pour WorkLog
      const workLogData: WorkLog = {
        id: workLogId || crypto.randomUUID(),
        projectId: data.linkedProjectId || '',
        date: data.date.toISOString().split('T')[0],
        personnel: data.personnel,
        timeTracking: {
          departure: data.departure || '',
          arrival: data.arrival || '',
          end: data.end || '',
          breakTime: data.breakTime || '',
          totalHours: Number(data.totalHours) || 0
        },
        duration: Number(data.totalHours) || 0,
        waterConsumption: 0,
        wasteManagement: data.wasteManagement || 'none',
        tasks: data.tasks || '',
        notes: data.notes || '',
        consumables: data.consumables || [],
        invoiced: Boolean(data.invoiced),
        isArchived: false,
        tasksPerformed: {
          watering: 'none',
          customTasks: {},
          tasksProgress: {}
        },
        isBlankWorksheet: true,
        createdAt: new Date(),
        createdBy: currentUserName,
        clientName: data.clientName,
        address: data.address,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        hourlyRate: data.hourlyRate,
        signedQuoteAmount: data.signedQuoteAmount,
        isQuoteSigned: data.isQuoteSigned,
        linkedProjectId: data.linkedProjectId,
        clientSignature: data.clientSignature
      };
      
      console.log('WorkLog data prepared for submission:', workLogData);
      
      // Soumission des données
      if (workLogId) {
        console.log('Updating existing worklog');
        await updateWorkLog(workLogData);
        toast.success('Fiche vierge mise à jour avec succès');
      } else {
        console.log('Creating new worklog');
        const result = await addWorkLog(workLogData);
        console.log('Worklog created successfully:', result);
        toast.success('Fiche vierge enregistrée avec succès');
      }
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('duplicate key')) {
          errorMessage = 'Cette fiche existe déjà';
        } else if (errorMessage.includes('foreign key')) {
          errorMessage = 'Projet ou données liées non trouvées';
        } else if (errorMessage.includes('not null')) {
          errorMessage = 'Certains champs obligatoires sont manquants';
        } else if (errorMessage.includes('permission denied')) {
          errorMessage = 'Permissions insuffisantes pour cette action';
        }
      }
      
      toast.error(`Erreur lors de l'enregistrement: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form cancellation
  const handleCancel = () => {
    form.reset();
    handleClearProject();
    navigate(-1);
  };
  
  return {
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleCancel
  };
};
