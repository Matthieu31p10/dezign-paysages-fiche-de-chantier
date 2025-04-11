
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { formatStructuredNotes, validateConsumables, createWorkLogFromFormData } from './utils/formatWorksheetData';
import { generateUniqueBlankSheetId } from './utils/generateUniqueIds';

interface SubmitWorksheetFormProps {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (workLog: WorkLog) => Promise<void>;
  existingWorkLogId?: string | null;
  onSuccess?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  workLogs?: WorkLog[];
}

/**
 * Main function to handle worksheet form submission
 * Processes form data, creates a WorkLog object, and saves it
 */
export async function submitWorksheetForm({
  data,
  addWorkLog,
  updateWorkLog,
  existingWorkLogId,
  onSuccess,
  setIsSubmitting,
  workLogs = []
}: SubmitWorksheetFormProps) {
  setIsSubmitting(true);
  
  try {
    // Format data for storage
    const structuredNotes = formatStructuredNotes(data);
    const validatedConsumables = validateConsumables(data.consumables);
    
    // Create the workLog object
    const workLog = createWorkLogFromFormData(
      data, 
      existingWorkLogId, 
      workLogs, 
      structuredNotes, 
      validatedConsumables
    );
    
    // Pour les nouvelles fiches vierges, générer un ID DZFV séquentiel
    if (!existingWorkLogId && (!workLog.projectId || workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('temp-'))) {
      // Remplacer l'ID temporaire par un ID séquentiel DZFV
      workLog.projectId = generateUniqueBlankSheetId(workLogs);
    }
    
    // Save or update the workLog
    if (existingWorkLogId) {
      await updateWorkLog(workLog);
    } else {
      await addWorkLog(workLog);
    }
    
    // Call the success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
  } finally {
    setIsSubmitting(false);
  }
}
