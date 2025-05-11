
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { executeSupabaseQuery, handleSupabaseError } from './supabaseClient';
import { formatWorkLogForDatabase, formatConsumablesForDatabase } from './formatters';

/**
 * Save workLogs to database
 */
export const saveWorkLogsToStorage = async (workLogs: WorkLog[]): Promise<void> => {
  try {
    console.log("Saving work logs to Supabase:", workLogs);
    
    // For each work log, upsert to database
    for (const workLog of workLogs) {
      // Prepare work log data for database
      const workLogData = formatWorkLogForDatabase(workLog);
      
      // Upsert the work log
      await executeSupabaseQuery(
        () => supabase.from('work_logs').upsert(workLogData, { onConflict: 'id' }),
        'Erreur lors de l\'enregistrement de la fiche de suivi'
      );
      
      // Handle consumables - first delete existing ones for this work log
      if (workLog.consumables && workLog.consumables.length > 0) {
        await executeSupabaseQuery(
          () => supabase.from('consumables').delete().eq('work_log_id', workLog.id),
          'Erreur lors de la mise à jour des consommables'
        );
        
        // Insert updated consumables
        const consumablesData = formatConsumablesForDatabase(workLog.id, workLog.consumables);
        
        await executeSupabaseQuery(
          () => supabase.from('consumables').insert(consumablesData),
          'Erreur lors de l\'enregistrement des consommables'
        );
      }
    }
    
    toast.success('Fiches de suivi sauvegardées avec succès');
  } catch (error) {
    console.error('Error saving work logs:', error);
    handleSupabaseError(error, 'Erreur lors de l\'enregistrement des fiches de suivi');
  }
};
