
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { WorkLogDetailContext } from './WorkLogDetailContext';
import { useWorkLogDetailProvider } from './useWorkLogDetailProvider';
import DetailHeader from './DetailHeader';
import WorkLogDetails from './WorkLogDetails';
import CustomTasksCard from './CustomTasksCard';
import NotesSection from './NotesSection';
import DeleteWorkLogDialog from './DeleteWorkLogDialog';
import HeaderActions from './HeaderActions';
import PDFOptionsDialog from './PDFOptionsDialog';

const WorkLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { workLogs, getProjectById, deleteWorkLog, updateWorkLog, settings } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get work log data
  const workLog = workLogs.find(log => log.id === id);
  const project = workLog ? getProjectById(workLog.projectId) : undefined;

  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      setIsLoading(false);
    }
  }, [id]);
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!workLog || !id) {
    return <Navigate to="/worklogs" />;
  }
  
  const contextValues = useWorkLogDetailProvider(
    workLog, 
    project, 
    workLogs,
    updateWorkLog,
    deleteWorkLog,
    settings
  );
  
  return (
    <WorkLogDetailContext.Provider value={contextValues}>
      <div className="animate-fade-in space-y-6">
        <DetailHeader 
          projectName={project?.name || 'Chantier inconnu'} 
          workLogDate={workLog.date}
          children={<HeaderActions workLogId={id} />} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <WorkLogDetails 
                  workLog={workLog} 
                  project={project}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <NotesSection />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <CustomTasksCard />
          </div>
        </div>
      </div>
      
      <DeleteWorkLogDialog 
        isOpen={contextValues.isDeleteDialogOpen}
        onOpenChange={contextValues.setIsDeleteDialogOpen}
      />
    </WorkLogDetailContext.Provider>
  );
};

export default WorkLogDetail;
