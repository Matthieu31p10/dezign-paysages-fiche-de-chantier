
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { toast } from 'sonner';

type SubmitHandlerParams = {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => void;
  updateWorkLog?: (workLog: WorkLog) => void;
  workLogId?: string;
  onSuccess?: () => void;
  setIsSubmitting: (value: boolean) => void;
};

export const submitWorksheetForm = async ({
  data,
  addWorkLog,
  updateWorkLog,
  workLogId,
  onSuccess,
  setIsSubmitting
}: SubmitHandlerParams) => {
  try {
    setIsSubmitting(true);
    
    if (!data.workDescription?.trim()) {
      toast.error("La description des travaux est obligatoire");
      setIsSubmitting(false);
      return;
    }
    
    // Ensure all consumables have required fields
    const validatedConsumables = data.consumables?.map(c => ({
      supplier: c.supplier || '',
      product: c.product || '',
      unit: c.unit || '',
      quantity: Number(c.quantity) || 0,
      unitPrice: Number(c.unitPrice) || 0,
      totalPrice: Number(c.totalPrice) || 0
    })) || [];
    
    // Format des données à enregistrer dans les notes pour faciliter l'extraction ultérieure
    const formattedNotes = `
CLIENT: ${data.clientName || ''}
ADRESSE: ${data.address || ''}
TELEPHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
${data.linkedProjectId ? `PROJET_LIE: ${data.linkedProjectId}` : ''}

DESCRIPTION DES TRAVAUX:
${data.workDescription}

${data.notes ? `NOTES ADDITIONNELLES:
${data.notes}` : ''}

TAUX_TVA: ${data.vatRate}
TAUX_HORAIRE: ${data.hourlyRate || 0}
DEVIS_SIGNE: ${data.signedQuote ? 'Oui' : 'Non'}
`;
    
    const workLogData: Omit<WorkLog, 'id' | 'createdAt'> = {
      projectId: workLogId ? 'blank-' + Date.now().toString() : 'blank-' + Date.now().toString(),
      date: data.date,
      duration: data.totalHours,
      personnel: data.personnel,
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
        watering: 'none',
        customTasks: {},
        tasksProgress: {}
      },
      notes: formattedNotes,
      wasteManagement: data.wasteManagement,
      consumables: validatedConsumables
    };
    
    if (workLogId && updateWorkLog) {
      // Si c'est une mise à jour
      updateWorkLog({
        ...workLogData,
        id: workLogId,
        createdAt: new Date() // On garde la date de création originale
      });
      toast.success("Fiche vierge mise à jour avec succès");
    } else {
      // Si c'est une nouvelle création
      addWorkLog(workLogData);
      toast.success("Fiche vierge créée avec succès");
    }
    
    if (onSuccess) {
      onSuccess();
    }
    
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour de la fiche:', error);
    toast.error("Erreur lors de la création/mise à jour de la fiche");
  } finally {
    setIsSubmitting(false);
  }
};
