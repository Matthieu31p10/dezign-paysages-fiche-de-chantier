
import { BlankWorkSheetValues } from '../../schema';
import { Consumable, WorkLog } from '@/types/models';

/**
 * Formats client and worksheet metadata into a structured notes format
 */
export const formatStructuredNotes = (data: BlankWorkSheetValues): string => {
  // Use optional chaining for vatRate or default to empty string
  const vatRateValue = data.vatRate || '20';
  
  return `
CLIENT: ${data.clientName || ''}
ADRESSE: ${data.address || ''}
TÉLÉPHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
ID PROJET: ${data.linkedProjectId || ''}
TAUX HORAIRE: ${data.hourlyRate || 0}
TVA: ${vatRateValue}
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
  return consumables.map(item => ({
    supplier: item.supplier || '',
    product: item.product || '',
    unit: item.unit || '',
    quantity: Number(item.quantity || 0),
    unitPrice: Number(item.unitPrice || 0),
    totalPrice: Number(item.totalPrice || 0)
  }));
};

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
    projectId = existingWorkLogId.startsWith('DZFV') 
      ? existingWorkLogId 
      : `DZFV${Date.now()}`;
  } else {
    projectId = generateUniqueBlankSheetId(workLogs);
  }
  
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
      totalHours: data.totalHours || 0
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
    hourlyRate: data.hourlyRate || 0,
    linkedProjectId: data.linkedProjectId || undefined,
    signedQuoteAmount: data.signedQuoteAmount || 0,
    isQuoteSigned: data.isQuoteSigned || false
  };
};

// Import from generateUniqueIds.ts to avoid circular dependencies
import { generateUniqueBlankSheetId, generateTemporaryId } from './generateUniqueIds';
