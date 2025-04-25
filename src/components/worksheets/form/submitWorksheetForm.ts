
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { formatStructuredNotes, validateConsumables, createWorkLogFromFormData } from './utils/formatWorksheetData';
import { generateUniqueBlankSheetId, isBlankWorksheet } from './utils/generateUniqueIds';

interface SubmitWorksheetFormProps {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (workLog: WorkLog) => Promise<void>;
  existingWorkLogId?: string | null;
  onSuccess?: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  workLogs?: WorkLog[];
  isBlankWorksheet?: boolean;
}

export async function submitWorksheetForm({
  data,
  addWorkLog,
  updateWorkLog,
  existingWorkLogId,
  onSuccess,
  setIsSubmitting,
  workLogs = [],
  isBlankWorksheet = false
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
    
    // For new blank worksheets, generate a DZFV sequential ID
    if (!existingWorkLogId && (isBlankWorksheet || (!workLog.projectId || workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('temp-')))) {
      // Replace temporary ID with a sequential DZFV ID
      workLog.projectId = generateUniqueBlankSheetId(workLogs);
      
      // Set a flag to identify this as a blank worksheet
      workLog.isBlankWorksheet = true;
    }
    
    // Add financial information
    workLog.hourlyRate = data.hourlyRate;
    workLog.signedQuoteAmount = data.signedQuoteAmount;
    workLog.isQuoteSigned = data.isQuoteSigned;
    workLog.invoiced = data.invoiced;
    
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
