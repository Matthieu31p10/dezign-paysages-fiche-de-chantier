
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkLog, ProjectInfo } from '@/types/models';
import { PDFOptions } from './WorkLogDetailContext';
import { useWorkLogCalculations } from './utils/useWorkLogCalculations';
import { usePDFExport } from './utils/usePDFExport';
import { useWorkLogActions } from './utils/useWorkLogActions';
import { toast } from 'sonner';

export const useWorkLogDetailProvider = (
  workLog?: WorkLog,
  project?: ProjectInfo,
  workLogs: WorkLog[] = [],
  updateWorkLog?: (id: string, partialWorkLog: Partial<WorkLog>) => void,
  deleteWorkLog?: (id: string) => void,
  settings?: any
) => {
  const navigate = useNavigate();
  
  // Use our new utility hooks
  const calculations = useWorkLogCalculations(workLog, project, workLogs);
  const pdfUtils = usePDFExport(workLog, project, settings);
  
  // For the notes and delete actions, we need to add the updateWorkLog function
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
      toast.success(`Fiche ${workLog.isBlankWorksheet ? 'vierge' : 'de suivi'} supprimée avec succès`);
      // Rediriger vers la liste appropriée en fonction du type de fiche
      navigate(workLog.isBlankWorksheet ? '/blank-worksheets' : '/worklogs');
    } catch (error) {
      console.error("Error deleting work log:", error);
      toast.error(`Erreur lors de la suppression de la fiche ${workLog.isBlankWorksheet ? 'vierge' : 'de suivi'}`);
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
  
  // Combine all the utilities into a single return value
  return {
    // From notes and delete actions
    notes,
    setNotes,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteWorkLog,
    confirmDelete,
    handleSaveNotes,
    
    // From calculations
    calculateEndTime: calculations.calculateEndTime,
    calculateHourDifference: calculations.calculateHourDifference,
    calculateTotalTeamHours: calculations.calculateTotalTeamHours,
    
    // From PDF export
    handleExportToPDF: pdfUtils.handleExportToPDF,
    handleSendEmail: pdfUtils.handleSendEmail,
    
    // Expose whether this is a blank worksheet
    isBlankWorksheet: workLog?.isBlankWorksheet || false
  };
};
