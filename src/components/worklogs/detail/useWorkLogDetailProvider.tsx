
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkLog, ProjectInfo } from '@/types/models';
import { PDFOptions } from './WorkLogDetailContext';
import { usePDFExport } from './utils/usePDFExport';
import { toast } from 'sonner';

export const useWorkLogDetailProvider = (
  workLog?: WorkLog,
  project?: ProjectInfo | null,
  workLogs: WorkLog[] = [],
  updateWorkLog?: (id: string, partialWorkLog: Partial<WorkLog>) => void,
  deleteWorkLog?: (id: string) => void,
  settings?: any
) => {
  const navigate = useNavigate();
  
  // Use our PDF export utility hook
  const { handleExportToPDF, isExporting } = usePDFExport({ 
    workLog: workLog as WorkLog, 
    project 
  });
  
  // For the notes and delete actions, we need to add the updateWorkLog function
  const [notes, setNotes] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Add placeholders for required context values
  const [isLoading] = useState(false);
  const [isEditable] = useState(true);
  
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

  // Time calculation utilities
  const calculateEndTime = (startTime: string, totalHours: number) => {
    if (!startTime || !totalHours) return "--:--";
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + totalHours * 60;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = Math.floor(totalMinutes % 60);
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  const calculateHourDifference = (planned: number, actual: number) => {
    return planned - actual;
  };
  
  const calculateTotalTeamHours = () => {
    if (!workLog) return 0;
    const totalHours = workLog.timeTracking?.totalHours || 0;
    const personnelCount = workLog.personnel?.length || 0;
    return totalHours * Math.max(1, personnelCount);
  };
  
  // Email functionality (placeholder)
  const handleSendEmail = () => {
    toast.info("Fonctionnalité d'envoi par email en développement");
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
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours,
    
    // From PDF export
    handleExportToPDF,
    isExporting,
    handleSendEmail,
    
    // Added required context values
    isLoading,
    isEditable,
    
    // Expose whether this is a blank worksheet
    isBlankWorksheet: workLog?.isBlankWorksheet || false
  };
};
