
import { WorkLog } from '@/types/models';
import { Dispatch, SetStateAction } from 'react';
import { saveWorkLogsToStorage } from '../../workLogsStorage';
import { toast } from 'sonner';

/**
 * Add a new WorkLog
 */
export const addWorkLog = async (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>,
  workLog: WorkLog
): Promise<WorkLog> => {
  if (!workLog.personnel || workLog.personnel.length === 0) {
    console.error("Invalid worklog data (missing personnel):", workLog);
    throw new Error('Personnel requis pour la fiche');
  }
  
  if (!workLog.date) {
    console.error("Invalid worklog data (missing date):", workLog);
    throw new Error('Date requise pour la fiche');
  }
  
  // S'assurer que createdAt est bien un objet Date
  const createdAt = workLog.createdAt instanceof Date ? workLog.createdAt : new Date();
  
  const newWorkLog: WorkLog = {
    ...workLog,
    id: workLog.id || crypto.randomUUID(),
    createdAt,
    isBlankWorksheet: workLog.isBlankWorksheet || false
  };
  
  console.log('Adding new WorkLog to state:', newWorkLog);
  
  try {
    // Sauvegarder dans Supabase d'abord
    await saveWorkLogsToStorage([newWorkLog]);
    
    // Puis mettre à jour l'état local
    setWorkLogs(prev => [...prev, newWorkLog]);
    
    console.log("WorkLog added successfully:", newWorkLog);
    return newWorkLog;
  } catch (error) {
    console.error("Error adding WorkLog:", error);
    throw new Error("Erreur lors de l'ajout de la fiche");
  }
};
