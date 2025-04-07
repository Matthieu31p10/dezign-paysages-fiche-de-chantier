
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WorkLog, ProjectInfo } from '@/types/models';
import { generatePDF } from '@/utils/pdf';
import { PDFOptions } from './WorkLogDetailContext';

export const useWorkLogDetailProvider = (
  workLog?: WorkLog,
  project?: ProjectInfo,
  workLogs: WorkLog[] = [],
  updateWorkLog?: (id: string, partialWorkLog: Partial<WorkLog>) => void,
  deleteWorkLog?: (id: string) => void,
  settings?: any
) => {
  const navigate = useNavigate();
  // Initialize notes state safely
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
  
  const calculateEndTime = () => {
    if (!workLog || !workLog.timeTracking) return "--:--";
    return workLog.timeTracking.end || "--:--";
  };
  
  const calculateHourDifference = () => {
    if (!workLog || !project) return "N/A";
    
    const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
    const completedVisits = projectWorkLogs.length;
    
    if (completedVisits === 0) return "N/A";
    
    const totalHoursCompleted = projectWorkLogs.reduce((total, log) => {
      if (log.timeTracking && typeof log.timeTracking.totalHours === 'number') {
        return total + log.timeTracking.totalHours;
      }
      return total;
    }, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    if (!project.visitDuration) return "N/A";
    
    const difference = project.visitDuration - averageHoursPerVisit;
    
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(2)} h`;
  };
  
  const calculateTotalTeamHours = () => {
    if (!workLog || !workLog.timeTracking || typeof workLog.timeTracking.totalHours !== 'number') {
      return "0";
    }
    
    const totalTeamHours = workLog.timeTracking.totalHours;
    return totalTeamHours.toFixed(2);
  };
  
  const handleExportToPDF = async (options: PDFOptions) => {
    if (!workLog || !project) {
      toast.error("Données manquantes pour générer le PDF");
      return;
    }
    
    try {
      // Vérification de la présence des données nécessaires
      if (!workLog.personnel || workLog.personnel.length === 0) {
        toast.error("Cette fiche de suivi n'a pas de personnel assigné");
        return;
      }
      
      const pdfData = {
        workLog,
        project: options.includeContactInfo ? project : undefined,
        endTime: calculateEndTime(),
        companyInfo: options.includeCompanyInfo ? settings?.companyInfo : undefined,
        companyLogo: options.includeCompanyInfo ? settings?.companyLogo : undefined,
        pdfOptions: options
      };
      
      const fileName = await generatePDF(pdfData);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };
  
  const handleSendEmail = () => {
    if (!project?.contact?.email) {
      toast.error("Aucune adresse email de contact n'est définie pour ce chantier");
      return;
    }
    
    // Sécurité: vérification de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(project.contact.email)) {
      toast.error("L'adresse email du contact n'est pas valide");
      return;
    }
    
    toast.success(`Email envoyé à ${project.contact.email}`);
  };
  
  return {
    notes,
    setNotes,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteWorkLog,
    confirmDelete,
    handleSaveNotes,
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours,
    handleExportToPDF,
    handleSendEmail
  };
};
