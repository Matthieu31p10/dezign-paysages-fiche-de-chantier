
import React from 'react';
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
  
  // Get the right workLog and project data
  const workLog = id ? workLogs.find(log => log.id === id) : undefined;
  const project = workLog ? getProjectById(workLog.projectId) : undefined;
  
  // Always call hooks at top-level, regardless of conditions
  const contextValues = useWorkLogDetailProvider(
    workLog, 
    project, 
    workLogs,
    updateWorkLog,
    deleteWorkLog,
    settings
  );
  
  // Early return if no workLog is found - AFTER all hooks are called
  if (!workLog || !id) {
    return <Navigate to="/worklogs" />;
  }
  
  return (
    <WorkLogDetailProvider value={{
      ...contextValues,
      workLog,
      project
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
