
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkLogDetails from './WorkLogDetails';
import DetailHeader from './DetailHeader';
import PDFOptionsDialog from './PDFOptionsDialog';
import DeleteWorkLogDialog from './DeleteWorkLogDialog';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { PDFOptions } from './WorkLogDetailContext';
import { WorkLogDetailProvider } from './WorkLogDetailContext';
import { toast } from 'sonner';
import { useWorkLogActions } from './utils/useWorkLogActions';
import { useWorkLogCalculations } from './utils/useWorkLogCalculations';
import usePDFExport from './utils/usePDFExport';
import { supabase } from '@/integrations/supabase/client';

const WorkLogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projectInfos } = useApp();
  const { workLogs, deleteWorkLog: deleteWorkLogContext } = useWorkLogs();
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
  
  // Trouver le workLog correspondant à l'ID
  const workLog = workLogs.find(log => log.id === id);
  const project = workLog ? projectInfos.find(project => project.id === workLog.projectId) : undefined;
  
  // Si le workLog n'existe pas, rediriger vers la page de fiches de suivi
  if (!workLog) {
    // Attente pour éviter les problèmes de rendu
    React.useEffect(() => {
      toast.error("Fiche de suivi non trouvée");
      navigate('/worklogs');
    }, [navigate]);
    
    return <div>Chargement...</div>;
  }

  const {
    notes,
    setNotes,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteWorkLog,
    confirmDelete,
    handleSaveNotes
  } = useWorkLogActions(workLog, deleteWorkLogContext);

  const {
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours
  } = useWorkLogCalculations(workLog);

  const { handleExportToPDF } = usePDFExport(workLog, project);
  
  // Gestion de l'envoi par email (à implémenter)
  const handleSendEmail = () => {
    // Cette fonctionnalité serait connectée à une Edge Function Supabase
    toast.info("Fonctionnalité d'envoi d'email en cours de développement");
  };
  
  // Vérification en temps réel de la connexion à Supabase
  React.useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.from('projects').select('id').limit(1);
      if (error) {
        console.error("Erreur de connexion à Supabase:", error);
        toast.error("Problème de connexion à la base de données");
      }
    };
    
    checkConnection();
  }, []);

  const contextValue = {
    workLog,
    project,
    notes,
    setNotes,
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours,
    handleSaveNotes,
    confirmDelete,
    handleDeleteWorkLog,
    handleExportToPDF,
    handleSendEmail,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  };
  
  return (
    <WorkLogDetailProvider value={contextValue}>
      <div className="space-y-6 animate-fade-in">
        <DetailHeader 
          workLog={workLog} 
          projectName={project?.name || 'Chantier inconnu'} 
          onExportClick={() => setIsPDFDialogOpen(true)}
        />
        
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tasks">Tâches effectuées</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <WorkLogDetails workLog={workLog} project={project} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardContent className="pt-6 whitespace-pre-wrap">
                {workLog.tasks ? workLog.tasks : "Aucune tâche spécifiée"}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[200px] p-3 border rounded-md"
                  placeholder="Ajoutez des notes ici..."
                />
                <div className="mt-4">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Enregistrer les notes
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DeleteWorkLogDialog />
        <PDFOptionsDialog 
          open={isPDFDialogOpen} 
          onOpenChange={setIsPDFDialogOpen} 
        />
      </div>
    </WorkLogDetailProvider>
  );
};

export default WorkLogDetail;
