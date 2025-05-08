
import { FormValues } from '../schema';
import { Consumable, WorkLog } from '@/types/models';

/**
 * Formate les notes structurées à partir des données du formulaire
 */
export const formatStructuredNotes = (data: FormValues): string => {
  // Vérification que data existe
  if (!data) return '';
  
  return `
CLIENT: ${data.clientName || ''}
ADRESSE: ${data.address || ''}
TÉLÉPHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
ID PROJET: ${data.linkedProjectId || ''}
TAUX HORAIRE: ${data.hourlyRate || 0}
TVA: ${data.vatRate || ''}
DEVIS SIGNÉ: ${data.isQuoteSigned ? 'oui' : 'non'}
VALEUR DEVIS: ${data.signedQuoteAmount || 0}
HEURE D'ENREGISTREMENT: ${new Date().toISOString()}
DESCRIPTION: ${data.notes || ''}
`;
};

/**
 * Valide et formate les consommables
 */
export const validateConsumables = (consumables: any[] = []): Consumable[] => {
  if (!Array.isArray(consumables)) return [];
  
  return consumables.map(item => ({
    id: item.id || crypto.randomUUID(),
    supplier: item.supplier || '',
    product: item.product || '',
    unit: item.unit || '',
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    totalPrice: Number(item.totalPrice) || 0
  }));
};

/**
 * Creates a WorkLog object from form data
 */
export const createWorkLogFromFormData = (
  data: FormValues,
  existingWorkLogId: string | null | undefined,
  workLogs: WorkLog[] = [],
  notes: string,
  consumables: Consumable[] = []
): WorkLog => {
  const id = existingWorkLogId || crypto.randomUUID();
  
  // Ensure numeric values are properly converted
  const duration = typeof data.duration === 'string' ? parseFloat(data.duration) || 0 : (data.duration || 0);
  const totalHours = typeof data.totalHours === 'string' ? parseFloat(data.totalHours) || 0 : (data.totalHours || 0);
  const waterConsumption = typeof data.waterConsumption === 'string' ? parseFloat(data.waterConsumption) || 0 : (data.waterConsumption || 0);
  
  // Ensure date is properly handled
  const date = data.date instanceof Date 
    ? data.date.toISOString() 
    : (typeof data.date === 'string' ? new Date(data.date).toISOString() : new Date().toISOString());

  // Créer l'objet WorkLog
  const workLog: WorkLog = {
    id,
    projectId: data.projectId || '',
    date,
    personnel: data.personnel || [],
    timeTracking: {
      departure: data.departure || '',
      arrival: data.arrival || '',
      end: data.end || '',
      breakTime: data.breakTime || '',
      totalHours
    },
    duration,
    waterConsumption,
    wasteManagement: data.wasteManagement || 'none',
    notes,
    consumables,
    invoiced: data.invoiced || false,
    tasksPerformed: {
      watering: data.watering || 'none',
      customTasks: data.customTasks || {},
      tasksProgress: data.tasksProgress || {}
    },
    createdAt: new Date(),
    isBlankWorksheet: false // Par défaut, c'est une fiche de suivi standard
  };
  
  // Ajouter les champs spécifiques aux fiches vierges si présents
  if (data.clientName) workLog.clientName = data.clientName;
  if (data.address) workLog.address = data.address;
  if (data.contactPhone) workLog.contactPhone = data.contactPhone;
  if (data.contactEmail) workLog.contactEmail = data.contactEmail;
  if (data.linkedProjectId) workLog.linkedProjectId = data.linkedProjectId;
  if (data.hourlyRate !== undefined) workLog.hourlyRate = data.hourlyRate;
  if (data.signedQuoteAmount !== undefined) workLog.signedQuoteAmount = data.signedQuoteAmount;
  if (data.isQuoteSigned !== undefined) workLog.isQuoteSigned = data.isQuoteSigned;
  
  return workLog;
};
