
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
      
      // Traiter les consommables
      const processedConsumables = (data.consumables || [])
        .filter(consumable => 
          consumable && 
          consumable.product && 
          consumable.product.trim() !== '' &&
          consumable.quantity > 0
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
        id: workLogId || crypto.randomUUID(),
        projectId: data.linkedProjectId || '', // Pour les fiches vierges, peut être vide
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
        consumables: processedConsumables,
        invoiced: Boolean(data.invoiced),
        isArchived: false,
        tasksPerformed: {
          watering: 'none',
          customTasks: {},
          tasksProgress: {}
        },
        isBlankWorksheet: true, // C'est toujours une fiche vierge dans ce contexte
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
        clientSignature: data.clientSignature,
        attachedDocuments: (data.attachedDocuments || []).map((doc: any) => ({
          name: doc.name || '',
          size: doc.size || 0,
          type: doc.type || '',
          lastModified: doc.lastModified || Date.now(),
          path: doc.path || undefined,
          url: doc.url || undefined
        }))
      };
      
      console.log('WorkLog data prepared for submission:', workLogData);
      
      // Soumission des données
      if (workLogId) {
        console.log('Updating existing blank worksheet');
        await updateWorkLog(workLogData);
        toast.success('Fiche vierge mise à jour avec succès');
      } else {
        console.log('Creating new blank worksheet');
        const result = await addWorkLog(workLogData);
        console.log('Blank worksheet created successfully:', result);
        // Sauvegarder le projet lié pour la prochaine fiche vierge
        if (workLogData.linkedProjectId) {
          localStorage.setItem('lastUsedLinkedProjectId', workLogData.linkedProjectId);
        }
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
