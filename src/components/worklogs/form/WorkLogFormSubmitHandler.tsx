
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './schema';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { WorkLog, Consumable } from '@/types/models';

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
  const { addWorkLog, updateWorkLog } = useWorkLogs();
  const { getCurrentUser } = useApp();
  
  const handleFormSubmit = async (formData: FormValues) => {
    console.log('Form submission started with data:', formData);
    
    try {
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
      
      // Valider et formater les consumables
      const validatedConsumables: Consumable[] = (formData.consumables || [])
        .filter(consumable => 
          consumable && 
          consumable.product && 
          consumable.product.trim() !== '' &&
          consumable.quantity && consumable.quantity > 0
        )
        .map(consumable => ({
          id: consumable.id || crypto.randomUUID(),
          supplier: consumable.supplier || '',
          product: consumable.product || '',
          unit: consumable.unit || 'unité',
          quantity: Number(consumable.quantity) || 0,
          unitPrice: Number(consumable.unitPrice) || 0,
          totalPrice: Number(consumable.totalPrice) || 0
        }));
      
      // Préparation des données pour WorkLog
      const workLogData: WorkLog = {
        id: existingWorkLogId || crypto.randomUUID(),
        projectId: formData.projectId || '', // Pour les fiches vierges, peut être vide
        date: formData.date.toISOString().split('T')[0],
        personnel: formData.personnel,
        timeTracking: {
          departure: formData.departure || '',
          arrival: formData.arrival || '',
          end: formData.end || '',
          breakTime: formData.breakTime || '',
          totalHours: Number(formData.totalHours) || 0
        },
        duration: Number(formData.duration) || 0,
        waterConsumption: Number(formData.waterConsumption) || 0,
        wasteManagement: formData.wasteManagement || 'none',
        tasks: '', // Champ requis pour la compatibilité
        notes: formData.notes || '',
        consumables: validatedConsumables,
        invoiced: Boolean(formData.invoiced),
        isArchived: false,
        tasksPerformed: {
          watering: formData.watering || 'none',
          customTasks: formData.customTasks || {},
          tasksProgress: formData.tasksProgress || {}
        },
        isBlankWorksheet: isBlankWorksheet,
        createdAt: new Date(),
        createdBy: currentUserName,
        // Champs spécifiques aux fiches vierges
        clientName: formData.clientName,
        address: formData.address,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        hourlyRate: formData.hourlyRate,
        signedQuoteAmount: formData.signedQuoteAmount,
        isQuoteSigned: formData.isQuoteSigned,
        linkedProjectId: formData.linkedProjectId,
        clientSignature: undefined // Sera géré séparément si nécessaire
      };
      
      console.log('WorkLog data prepared for submission:', workLogData);
      
      // Soumission des données
      if (existingWorkLogId) {
        console.log('Updating existing worklog');
        await updateWorkLog(workLogData);
        toast.success(`Fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'} mise à jour avec succès`);
      } else {
        console.log('Creating new worklog');
        const result = await addWorkLog(workLogData);
        console.log('Worklog created successfully:', result);
        toast.success(`Fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'} enregistrée avec succès`);
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
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="w-full">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
