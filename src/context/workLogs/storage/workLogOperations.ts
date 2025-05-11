
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { executeSupabaseQuery, handleSupabaseError } from './supabaseClient';
import { formatWorkLogForDatabase, formatWorkLogFromDatabase } from './formatters';

/**
 * Load workLogs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs from Supabase");
    
    // Fetch work logs from Supabase
    const workLogsData = await executeSupabaseQuery<any[]>(
      () => supabase.from('work_logs').select('*'),
      'Erreur lors du chargement des fiches de suivi'
    );
    
    // Fetch all consumables to map them to their respective work logs
    const consumablesData = await executeSupabaseQuery<any[]>(
      () => supabase.from('consumables').select('*'),
      'Erreur lors du chargement des consommables'
    );
    
    // Map the consumables to their work logs
    const workLogs: WorkLog[] = workLogsData.map(log => 
      formatWorkLogFromDatabase(log, consumablesData)
    );
    
    return workLogs;
  } catch (error) {
    console.error('Error loading work logs:', error);
    handleSupabaseError(error, 'Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Delete a work log from the database
 */
export const deleteWorkLogFromStorage = async (workLogId: string): Promise<void> => {
  try {
    console.log("Deleting work log from Supabase:", workLogId);
    
    // Delete the work log (cascade will handle consumables deletion)
    await executeSupabaseQuery<null>(
      () => supabase.from('work_logs').delete().eq('id', workLogId),
      'Erreur lors de la suppression de la fiche de suivi'
    );
    
  } catch (error) {
    handleSupabaseError(error, 'Erreur lors de la suppression de la fiche de suivi');
  }
};
