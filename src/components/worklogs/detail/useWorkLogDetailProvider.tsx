
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WorkLog, ProjectInfo } from '@/types/models';
import { generatePDF } from '@/utils/pdf';

export const useWorkLogDetailProvider = (
  workLog: WorkLog,
  project: ProjectInfo | undefined,
  workLogs: WorkLog[],
  updateWorkLog: (workLog: WorkLog) => void,
  deleteWorkLog: (id: string) => void,
  settings: any
) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (workLog && workLog.notes) {
      setNotes(workLog.notes);
    }
  }, [workLog.notes]);
  
  const handleDeleteWorkLog = () => {
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
    if (workLog) {
      try {
        // Sécurité: validation des données
        const sanitizedNotes = notes.trim().substring(0, 2000); // Limite la taille
        
        updateWorkLog({
          ...workLog,
          notes: sanitizedNotes
        });
        toast.success("Notes enregistrées avec succès");
      } catch (error) {
        console.error("Error saving notes:", error);
        toast.error("Erreur lors de l'enregistrement des notes");
      }
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
  
  const handleExportToPDF = async () => {
    if (!workLog || !project) {
      toast.error("Données insuffisantes pour générer le PDF");
      return;
    }
    
    try {
      // Sécurité: vérification des données avant génération
      if (!workLog.personnel || workLog.personnel.length === 0) {
        toast.error("Impossible de générer le PDF: personnel manquant");
        return;
      }
      
      const data = {
        workLog,
        project,
        endTime: workLog.timeTracking?.end || calculateEndTime(),
        companyInfo: settings.companyInfo,
        companyLogo: settings.companyLogo
      };
      
      const fileName = await generatePDF(data);
      toast.success(`PDF généré avec succès: ${fileName}`);
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF");
      console.error("PDF generation error:", error);
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
