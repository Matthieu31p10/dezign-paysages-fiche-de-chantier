
import { BlankWorkSheetValues } from '../../schema';
import { Consumable, WorkLog } from '@/types/models';

/**
 * Formats client and worksheet metadata into a structured notes format
 */
export const formatStructuredNotes = (data: BlankWorkSheetValues): string => {
  return `
CLIENT: ${data.clientName || ''}
ADRESSE: ${data.address || ''}
TÉLÉPHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
ID PROJET: ${data.linkedProjectId || ''}
TAUX HORAIRE: ${data.hourlyRate || 0}
TVA: ${data.vatRate || '20'}
DEVIS SIGNÉ: ${data.isQuoteSigned ? 'oui' : 'non'}
VALEUR DEVIS: ${data.signedQuoteAmount || 0}
HEURE D'ENREGISTREMENT: ${new Date().toISOString()}
DESCRIPTION: ${data.notes || ''}
`;
};

/**
 * Validates and normalizes consumable data
 */
export const validateConsumables = (consumables: any[] = []): Consumable[] => {
  if (!Array.isArray(consumables)) return [];
  
  return consumables.map(item => ({
    id: item.id || crypto.randomUUID(),
    supplier: item.supplier || '',
    product: item.product || '',
    unit: item.unit || '',
    quantity: Number(item.quantity || 0),
    unitPrice: Number(item.unitPrice || 0),
    totalPrice: Number(item.totalPrice || 0)
  }));
};

// Import from generateUniqueIds.ts pour éviter les dépendances circulaires
import { generateUniqueBlankSheetId, generateTemporaryId } from './generateUniqueIds';

/**
 * Creates a WorkLog object from form data
 */
export const createWorkLogFromFormData = (
  data: BlankWorkSheetValues, 
  existingWorkLogId: string | null | undefined,
  workLogs: WorkLog[] = [],
  structuredNotes: string,
  validatedConsumables: Consumable[]
): WorkLog => {
  const id = existingWorkLogId || generateTemporaryId();
  
  // Generate or maintain the project ID
  let projectId;
  if (existingWorkLogId) {
    // Pour les mises à jour, conserver l'ID existant
    const existingWorkLog = workLogs.find(w => w.id === existingWorkLogId);
    projectId = existingWorkLog?.projectId || `DZFV${Date.now()}`;
  } else {
    // Pour les nouvelles fiches, générer un ID unique
    projectId = generateUniqueBlankSheetId(workLogs);
  }
  
  // Création de l'objet WorkLog avec validation des données
  return {
    id,
    projectId,
    date: data.date.toISOString(),
    personnel: data.personnel || [],
    timeTracking: {
      departure: data.departure || '',
      arrival: data.arrival || '',
      end: data.end || '',
      breakTime: data.breakTime || '',
      totalHours: Number(data.totalHours || 0)
    },
    notes: structuredNotes,
    tasks: data.tasks || '',
    wasteManagement: data.wasteManagement || 'none',
    consumables: validatedConsumables,
    clientSignature: data.clientSignature || null,
    clientName: data.clientName || '',
    address: data.address || '',
    contactPhone: data.contactPhone || '',
    contactEmail: data.contactEmail || '',
    hourlyRate: Number(data.hourlyRate || 0),
    linkedProjectId: data.linkedProjectId || undefined,
    signedQuoteAmount: Number(data.signedQuoteAmount || 0),
    isQuoteSigned: Boolean(data.isQuoteSigned || false),
    isBlankWorksheet: true,
    createdAt: new Date(), // S'assurer que createdAt est un objet Date
    invoiced: Boolean(data.invoiced || false)
  };
};
