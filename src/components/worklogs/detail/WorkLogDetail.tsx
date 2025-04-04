
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { generatePDF } from '@/utils/pdf';
import { WorkLogDetailProvider } from './WorkLogDetailContext';
import DetailHeader from './DetailHeader';
import WorkLogDetails from './WorkLogDetails';
import CustomTasksCard from './CustomTasksCard';
import NotesSection from './NotesSection';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
         AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
         AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const WorkLogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workLogs, getProjectById, updateWorkLog, deleteWorkLog, settings } = useApp();
  const [notes, setNotes] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const workLog = workLogs.find(log => log.id === id);
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de suivi non trouvée</h2>
        <Button onClick={() => navigate('/worklogs')} variant="default" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const project = getProjectById(workLog.projectId);
  
  useEffect(() => {
    if (workLog.notes) {
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
  
  const calculateTotalTeamHours = () => {
    if (!workLog || !workLog.timeTracking || typeof workLog.timeTracking.totalHours !== 'number') {
      return "0";
    }
    
    const totalTeamHours = workLog.timeTracking.totalHours;
    return totalTeamHours.toFixed(2);
  };
  
  const contextValue = {
    workLog,
    project,
    notes,
    setNotes,
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours,
    handleSaveNotes,
    handleDeleteWorkLog,
    confirmDelete,
    handleExportToPDF,
    handleSendEmail
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WorkLogDetailProvider value={contextValue}>
        <DetailHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WorkLogDetails />
            
            <div className="mt-6">
              <NotesSection />
            </div>
          </div>
          
          <div>
            <CustomTasksCard />
          </div>
        </div>
      </WorkLogDetailProvider>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette fiche de suivi ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkLog} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkLogDetail;
