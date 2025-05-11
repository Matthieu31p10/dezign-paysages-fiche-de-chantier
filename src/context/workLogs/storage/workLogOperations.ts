
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatWorkLogForDatabase, formatWorkLogFromDatabase } from './formatters';
import { executeSupabaseQuery } from './supabaseClient';

/**
 * Load work logs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs from Supabase");
    
    const data = await executeSupabaseQuery<any[]>(
      () => supabase.from('work_logs').select('*'),
      'Erreur lors du chargement des fiches de suivi'
    );
    
    // Map the work logs to their app format
    const workLogs: WorkLog[] = data.map(workLog => 
      formatWorkLogFromDatabase(workLog)
    );
    
    return workLogs;
  } catch (error) {
    console.error('Error loading work logs:', error);
    toast.error('Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Delete a work log from the database
 */
export const deleteWorkLogFromStorage = async (workLogId: string): Promise<void> => {
  try {
    console.log("Deleting work log from Supabase:", workLogId);
    
    // Vérifier si le workLogId est valide avant de tenter de le supprimer
    if (!workLogId || typeof workLogId !== 'string' || workLogId.trim() === '') {
      throw new Error('Invalid work log ID');
    }
    
    await executeSupabaseQuery(
      () => supabase
        .from('work_logs')
        .delete()
        .eq('id', workLogId),
      'Erreur lors de la suppression de la fiche de suivi'
    );
    
    // Supprimer également les consommables associés
    await executeSupabaseQuery(
      () => supabase
        .from('consumables')
        .delete()
        .eq('work_log_id', workLogId),
      'Erreur lors de la suppression des consommables associés'
    );
    
  } catch (error) {
    console.error('Error deleting work log:', error);
    toast.error('Erreur lors de la suppression de la fiche de suivi');
    throw error;
  }
};
