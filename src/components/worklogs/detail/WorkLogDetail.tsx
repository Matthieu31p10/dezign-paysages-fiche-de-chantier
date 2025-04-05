
import React, { useEffect, useState } from 'react';
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

const WorkLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { workLogs, getProjectById, deleteWorkLog, updateWorkLog, settings } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize these variables outside of any conditions to maintain hook order
  const workLog = id ? workLogs.find(log => log.id === id) : undefined;
  const project = workLog ? getProjectById(workLog.projectId) : undefined;
  
  useEffect(() => {
    if (id) {
      setIsLoading(false);
    }
  }, [id]);
  
  // Early return for loading state - before any hooks that depend on loaded data
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // Early return for invalid data - before any hooks that depend on valid data
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
    <WorkLogDetailProvider value={{
      ...contextValues,
      workLog,  // Make sure to pass workLog to the context
      project   // Make sure to pass project to the context
    }}>
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
    </WorkLogDetailProvider>
  );
};

export default WorkLogDetail;
