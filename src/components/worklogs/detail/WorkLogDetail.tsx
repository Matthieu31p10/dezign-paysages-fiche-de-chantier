
import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { WorkLogDetailProvider } from './WorkLogDetailContext';
import { useWorkLogDetailProvider } from './useWorkLogDetailProvider';
import DetailHeader from './DetailHeader';
import WorkLogDetails from './WorkLogDetails';
import CustomTasksCard from './CustomTasksCard';
import NotesSection from './NotesSection';
import DeleteWorkLogDialog from './DeleteWorkLogDialog';
import HeaderActions from './HeaderActions';
import { Loader2 } from 'lucide-react';

// Chargement paresseux des composants pour de meilleures performances
const LazyNotesSection = React.lazy(() => import('./NotesSection'));
const LazyCustomTasksCard = React.lazy(() => import('./CustomTasksCard'));

const WorkLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { workLogs, getProjectById, deleteWorkLog, updateWorkLog, settings, isLoading } = useApp();
  
  // Sécurité: vérifier si id existe
  if (!id) {
    console.warn("WorkLogDetail - ID not provided");
    return <Navigate to="/worklogs" />;
  }
  
  // Obtenir les bonnes données workLog et projet
  const workLog = workLogs.find(log => log.id === id);
  const project = workLog ? getProjectById(workLog.projectId) : undefined;
  
  // Toujours appeler les hooks au niveau supérieur, quelles que soient les conditions
  const contextValues = useWorkLogDetailProvider(
    workLog, 
    project, 
    workLogs,
    updateWorkLog,
    deleteWorkLog,
    settings
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }
  
  // Retour anticipé si aucun workLog n'est trouvé - APRÈS que tous les hooks sont appelés
  if (!workLog) {
    console.warn(`WorkLogDetail - WorkLog with ID ${id} not found`);
    return <Navigate to="/worklogs" />;
  }
  
  return (
    <WorkLogDetailProvider value={contextValues}>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-start">
          <DetailHeader />
          <HeaderActions workLogId={id} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <WorkLogDetails />
              </CardContent>
            </Card>
            
            <Suspense fallback={
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            }>
              <Card>
                <CardContent className="pt-6">
                  <LazyNotesSection />
                </CardContent>
              </Card>
            </Suspense>
          </div>
          
          <div className="space-y-6">
            <Suspense fallback={
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            }>
              <LazyCustomTasksCard />
            </Suspense>
          </div>
        </div>
      </div>
      
      <DeleteWorkLogDialog 
        isOpen={contextValues.isDeleteDialogOpen}
        onOpenChange={contextValues.setIsDeleteDialogOpen}
      />
    </WorkLogDetailProvider>
  );
};

export default WorkLogDetail;
