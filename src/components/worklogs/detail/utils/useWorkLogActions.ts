
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WorkLog } from '@/types/models';

export const useWorkLogActions = (
  workLog?: WorkLog,
  deleteWorkLog?: (id: string) => void
) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(workLog?.notes || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Update notes when workLog changes
  useEffect(() => {
    if (workLog && workLog.notes) {
      setNotes(workLog.notes);
    }
  }, [workLog?.notes]);
  
  const handleDeleteWorkLog = () => {
    if (!workLog || !deleteWorkLog) return;
    
    setIsDeleteDialogOpen(false);
    try {
      deleteWorkLog(workLog.id);
      toast.success("Fiche de suivi supprimée avec succès");
      navigate('/worklogs');
    } catch (error) {
      console.error("Error deleting work log:", error);
      toast.error("Erreur lors de la suppression de la fiche de suivi");
    }
  };
  
  const confirmDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveNotes = () => {
    if (!workLog || !updateWorkLog) return;
    
    try {
      // Sécurité: validation des données
      const sanitizedNotes = notes.trim().substring(0, 2000); // Limite la taille
      
      updateWorkLog(workLog.id, {
        notes: sanitizedNotes
      });
      toast.success("Notes enregistrées avec succès");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Erreur lors de l'enregistrement des notes");
    }
  };
  
  return {
    notes,
    setNotes,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteWorkLog,
    confirmDelete,
    handleSaveNotes
  };
};

// This is a placeholder for the updateWorkLog function
// It will be injected when the hook is used
const updateWorkLog = (id: string, partialWorkLog: Partial<WorkLog>) => {
  console.log('Update work log:', id, partialWorkLog);
};
