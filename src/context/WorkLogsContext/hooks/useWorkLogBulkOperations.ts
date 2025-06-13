
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkLogBulkOperations = (setWorkLogs: React.Dispatch<React.SetStateAction<WorkLog[]>>) => {
  const deleteWorkLogsByProjectId = async (projectId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .delete()
        .eq('project_id', projectId);

      if (error) throw error;

      setWorkLogs((prev) => prev.filter((log) => log.projectId !== projectId));
      toast.success('Fiches de suivi du projet supprimées');
    } catch (error) {
      console.error("Error deleting work logs by project:", error);
      toast.error('Erreur lors de la suppression des fiches du projet');
      throw error;
    }
  };

  const archiveWorkLogsByProjectId = async (projectId: string, archived: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .update({ is_archived: archived })
        .eq('project_id', projectId);

      if (error) throw error;

      setWorkLogs((prev) => prev.map((log) => 
        log.projectId === projectId ? { ...log, isArchived: archived } : log
      ));
      
      toast.success(archived ? 'Fiches de suivi archivées' : 'Fiches de suivi désarchivées');
    } catch (error) {
      console.error("Error archiving work logs by project:", error);
      toast.error('Erreur lors de l\'archivage des fiches du projet');
      throw error;
    }
  };

  return {
    deleteWorkLogsByProjectId,
    archiveWorkLogsByProjectId
  };
};
