
import { toast } from 'sonner';
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { formatConsumableNotes } from '@/utils/helpers';

// Generate a unique DZFV code with an incremental number
const generateDZFVCode = (): string => {
  // Get all existing DZFV codes from localStorage
  const existingCodes: string[] = [];
  try {
    const storedWorkLogs = localStorage.getItem('landscaping-worklogs');
    if (storedWorkLogs) {
      const parsedLogs: WorkLog[] = JSON.parse(storedWorkLogs);
      parsedLogs.forEach(log => {
        if (log.projectId && log.projectId.startsWith('DZFV')) {
          existingCodes.push(log.projectId);
        }
      });
    }
  } catch (error) {
    console.error('Error reading existing codes:', error);
  }

  // Find the highest number in existing DZFV codes
  let highestNumber = 0;
  existingCodes.forEach(code => {
    // Extract the numeric part of the DZFV code
    const match = code.match(/DZFV(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1]);
      if (!isNaN(num) && num > highestNumber) {
        highestNumber = num;
      }
    }
  });

  // Generate the next code (increment by 1)
  const nextNumber = highestNumber + 1;
  return `DZFV${nextNumber.toString().padStart(4, '0')}`;
};

// Use native crypto.randomUUID if available, otherwise provide a simple fallback
const generateUUID = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

interface SubmitWorksheetFormParams {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: WorkLog) => WorkLog;
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
    // Get current date and time for registration timestamp
    const now = new Date();
    const registrationTime = now.toISOString();
    
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
REGISTRATION_TIME: ${registrationTime}
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

    // Generate a DZFV code for new worksheets
    const projectId = existingWorkLogId 
      ? undefined 
      : generateDZFVCode();

    // Créer l'objet workLog
    const workLogData: Partial<WorkLog> = {
      projectId: projectId,
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
      createdAt: existingWorkLogId ? undefined : now
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
        projectId: projectId || `DZFV${now.getTime().toString().slice(-4)}`, // Fallback si la génération échoue
        createdAt: now
      } as WorkLog;
      
      await addWorkLog(newWorkLog);
      toast.success(`Fiche vierge créée avec succès (Code: ${newWorkLog.projectId})`);
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
