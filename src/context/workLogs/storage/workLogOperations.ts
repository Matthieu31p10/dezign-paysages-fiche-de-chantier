
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatWorkLogForDatabase, formatWorkLogFromDatabase } from './formatters';
import { handleSupabaseError } from './supabaseClient';

/**
 * Load work logs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs from Supabase");
    
    const { data: workLogsData, error: workLogsError } = await supabase
      .from('work_logs')
      .select('*');
    
    if (workLogsError) {
      handleSupabaseError(workLogsError, 'Erreur lors du chargement des fiches de suivi');
      return [];
    }
    
    // Get all consumables for all work logs in one query
    const { data: consumablesData, error: consumablesError } = await supabase
      .from('consumables')
      .select('*');
    
    if (consumablesError) {
      console.warn('Error loading consumables:', consumablesError);
    }
    
    // Map the work logs to their app format
    const workLogs: WorkLog[] = (workLogsData || []).map(workLog => 
      formatWorkLogFromDatabase(workLog, (consumablesData || []).filter(c => c.work_log_id === workLog.id))
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
    
    const { error: workLogError } = await supabase
      .from('work_logs')
      .delete()
      .eq('id', workLogId);
    
    if (workLogError) {
      handleSupabaseError(workLogError, 'Erreur lors de la suppression de la fiche de suivi');
      return;
    }
    
    // Supprimer également les consommables associés
    const { error: consumablesError } = await supabase
      .from('consumables')
      .delete()
      .eq('work_log_id', workLogId);
    
    if (consumablesError) {
      console.warn('Error deleting associated consumables:', consumablesError);
    }
    
  } catch (error) {
    console.error('Error deleting work log:', error);
    toast.error('Erreur lors de la suppression de la fiche de suivi');
    throw error;
  }
};
