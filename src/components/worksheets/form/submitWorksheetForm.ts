
import { BlankWorkSheetValues } from '../schema';
import { useApp } from '@/context/AppContext';

interface SubmitWorksheetFormProps {
  data: BlankWorkSheetValues;
  addWorkLog: ReturnType<typeof useApp>['addWorkLog'];
  updateWorkLog: ReturnType<typeof useApp>['updateWorkLog'];
  existingWorkLogId?: string | null;
  onSuccess?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

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
PHONE: ${data.contactPhone || ''}
EMAIL: ${data.contactEmail || ''}
PROJECT_ID: ${data.linkedProjectId || ''}
HOURLY_RATE: ${data.hourlyRate || 0}
VAT_RATE: ${data.vatRate || '20'}
SIGNED_QUOTE: ${data.signedQuote ? 'true' : 'false'}
QUOTE_VALUE: ${data.quoteValue || 0}
DESCRIPTION: ${data.notes || ''}
`;
    
    // Création de l'objet workLog
    const workLog = {
      id: existingWorkLogId || `blank-${Date.now()}`,
      projectId: data.linkedProjectId ? `blank-${data.linkedProjectId}` : 'blank',
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
      consumables: data.consumables || []
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
