
import { toast } from 'sonner';
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { formatConsumableNotes } from '@/utils/helpers';

// Use native crypto.randomUUID if available, otherwise provide a simple fallback
const generateUUID = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

interface SubmitWorksheetFormParams {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: WorkLog) => void;
  updateWorkLog?: (id: string, workLog: Partial<WorkLog>) => void;
  existingWorkLogId?: string | null;
  onSuccess?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const submitWorksheetForm = async ({
  data,
  addWorkLog,
  updateWorkLog,
  existingWorkLogId,
  onSuccess,
  setIsSubmitting
}: SubmitWorksheetFormParams) => {
  setIsSubmitting(true);
  
  try {
    // Format des notes pour stocker les informations supplémentaires
    const formattedNotes = `CLIENT_NAME: ${data.clientName}
ADDRESS: ${data.address}
${data.contactPhone ? `CONTACT_PHONE: ${data.contactPhone}` : ''}
${data.contactEmail ? `CONTACT_EMAIL: ${data.contactEmail}` : ''}
DESCRIPTION: ${data.workDescription}
${data.hourlyRate ? `HOURLY_RATE: ${data.hourlyRate}` : ''}
VAT_RATE: ${data.vatRate}
SIGNED_QUOTE: ${data.signedQuote ? 'true' : 'false'}
${data.linkedProjectId ? `LINKED_PROJECT_ID: ${data.linkedProjectId}` : ''}
${formatConsumableNotes(data.consumables)}`;

    // Ensure all consumables are properly typed
    const typedConsumables = data.consumables?.map(item => ({
      supplier: item.supplier || '',
      product: item.product || '',
      unit: item.unit || '',
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: Number(item.totalPrice) || 0
    })) || [];

    // Créer l'objet workLog
    const workLogData: Partial<WorkLog> = {
      projectId: `blank-${!existingWorkLogId ? generateUUID() : existingWorkLogId}`,
      date: data.date,
      personnel: data.personnel,
      duration: data.totalHours,
      timeTracking: {
        departure: data.departure,
        arrival: data.arrival,
        end: data.end,
        breakTime: data.breakTime,
        totalHours: data.totalHours
      },
      tasksPerformed: {
        mowing: false,
        brushcutting: false,
        blower: false,
        manualWeeding: false,
        whiteVinegar: false,
        pruning: {
          done: false,
          progress: 0
        },
        watering: 'none'
      },
      wasteManagement: data.wasteManagement,
      notes: formattedNotes,
      consumables: typedConsumables,
      hourlyRate: data.hourlyRate,
      createdAt: existingWorkLogId ? undefined : new Date()
    };
    
    // Ajouter ou mettre à jour la fiche selon le cas
    if (existingWorkLogId && updateWorkLog) {
      await updateWorkLog(existingWorkLogId, workLogData);
      toast.success('Fiche vierge modifiée avec succès');
    } else {
      // Pour une nouvelle fiche, on doit avoir un objet WorkLog complet
      const newWorkLog: WorkLog = {
        ...workLogData,
        id: generateUUID(),
        createdAt: new Date()
      } as WorkLog;
      
      await addWorkLog(newWorkLog);
      toast.success('Fiche vierge créée avec succès');
    }
    
    // Exécuter le callback de succès s'il est fourni
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
    toast.error('Une erreur est survenue lors de la création de la fiche');
  } finally {
    setIsSubmitting(false);
  }
};
