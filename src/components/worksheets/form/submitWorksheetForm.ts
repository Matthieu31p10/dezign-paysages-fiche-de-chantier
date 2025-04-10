
import { BlankWorkSheetValues } from '../schema';
import { useApp } from '@/context/AppContext';
import { WorkLog, Consumable } from '@/types/models';

interface SubmitWorksheetFormProps {
  data: BlankWorkSheetValues;
  addWorkLog: ReturnType<typeof useApp>['addWorkLog'];
  updateWorkLog: ReturnType<typeof useApp>['updateWorkLog'];
  existingWorkLogId?: string | null;
  onSuccess?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

// Fonction pour générer un ID unique pour les fiches vierges
const generateUniqueBlankSheetId = (workLogs: WorkLog[]): string => {
  // Trouver le dernier numéro utilisé pour les fiches vierges
  let maxNumber = 0;
  
  workLogs.forEach(log => {
    if (log.projectId && log.projectId.startsWith('DZFV')) {
      const numberPart = log.projectId.substring(4); // Extraire la partie numérique après "DZFV"
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  // Créer un nouvel ID avec le prochain numéro
  const nextNumber = maxNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(5, '0');
  return `DZFV${paddedNumber}`;
};

export async function submitWorksheetForm({
  data,
  addWorkLog,
  updateWorkLog,
  existingWorkLogId,
  onSuccess,
  setIsSubmitting
}: SubmitWorksheetFormProps) {
  setIsSubmitting(true);
  
  try {
    // Format des notes structurées pour stocker les métadonnées
    const structuredNotes = `
CLIENT: ${data.clientName || ''}
ADRESSE: ${data.address || ''}
TÉLÉPHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
ID PROJET: ${data.linkedProjectId || ''}
TAUX HORAIRE: ${data.hourlyRate || 0}
TVA: ${data.vatRate || '20'}
DEVIS SIGNÉ: ${data.signedQuote ? 'oui' : 'non'}
VALEUR DEVIS: ${data.quoteValue || 0}
HEURE D'ENREGISTREMENT: ${new Date().toISOString()}
DESCRIPTION: ${data.notes || ''}
`;
    
    // Ensure consumables conform to the Consumable type with required fields
    const validatedConsumables: Consumable[] = (data.consumables || []).map(item => ({
      supplier: item.supplier || '',
      product: item.product || '',
      unit: item.unit || '',
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      totalPrice: Number(item.totalPrice || 0)
    }));
    
    // Création de l'objet workLog
    const workLog: WorkLog = {
      id: existingWorkLogId || `blank-${Date.now()}`,
      projectId: existingWorkLogId ? 
        (existingWorkLogId.startsWith('DZFV') ? existingWorkLogId : `DZFV${Date.now()}`) : 
        generateUniqueBlankSheetId(workLogContext?.workLogs || []),
      date: data.date.toISOString(),
      personnel: data.personnel || [],
      timeTracking: {
        departure: data.departure,
        arrival: data.arrival,
        end: data.end,
        breakTime: data.breakTime,
        totalHours: data.totalHours
      },
      notes: structuredNotes,
      tasks: data.tasks || '',
      wasteManagement: data.wasteManagement || 'none',
      consumables: validatedConsumables,
      clientSignature: data.clientSignature // Ajout de la signature du client
    };
    
    if (existingWorkLogId) {
      await updateWorkLog(workLog);
    } else {
      await addWorkLog(workLog);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
  } finally {
    setIsSubmitting(false);
  }
}
