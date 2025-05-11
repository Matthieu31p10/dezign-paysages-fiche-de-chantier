
import { WorkLog } from '@/types/models';
import { Dispatch, SetStateAction } from 'react';
import { deleteWorkLogFromStorage } from '../../workLogsStorage';
import { toast } from 'sonner';

/**
 * Delete a WorkLog by ID
 */
export const deleteWorkLog = async (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>,
  id: string
): Promise<void> => {
  try {
    // Vérifier si la fiche existe
    if (!workLogs.some(w => w.id === id)) {
      throw new Error(`Fiche avec ID ${id} introuvable`);
    }
    
    // Supprimer de Supabase d'abord
    await deleteWorkLogFromStorage(id);
    
    // Puis mettre à jour l'état local
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
    
    toast.success('Fiche supprimée avec succès');
  } catch (error) {
    console.error("Error deleting WorkLog:", error);
    toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};

/**
 * Delete all WorkLogs for a project
 */
export const deleteWorkLogsByProjectId = async (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>,
  projectId: string
): Promise<void> => {
  try {
    // Filtrer les fiches par projet
    const logsToDelete = workLogs.filter(w => w.projectId === projectId);
    
    if (logsToDelete.length === 0) return;
    
    // Supprimer chaque fiche de Supabase
    for (const log of logsToDelete) {
      await deleteWorkLogFromStorage(log.id);
    }
    
    // Puis mettre à jour l'état local
    setWorkLogs((prev) => prev.filter((w) => w.projectId !== projectId));
    
    toast.success(`${logsToDelete.length} fiches supprimées avec succès`);
  } catch (error) {
    console.error("Error deleting WorkLogs by ProjectId:", error);
    toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};
