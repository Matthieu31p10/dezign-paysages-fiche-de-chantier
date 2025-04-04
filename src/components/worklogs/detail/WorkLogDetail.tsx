
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { WorkLogDetailProvider } from './WorkLogDetailContext';
import DetailHeader from './DetailHeader';
import WorkLogDetails from './WorkLogDetails';
import CustomTasksCard from './CustomTasksCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DeleteWorkLogDialog from './DeleteWorkLogDialog';
import { useWorkLogDetailProvider } from './useWorkLogDetailProvider';

const WorkLogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workLogs, getProjectById, updateWorkLog, deleteWorkLog, settings } = useApp();
  
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
  
  const {
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
  } = useWorkLogDetailProvider(workLog, project, workLogs, updateWorkLog, deleteWorkLog, settings);
  
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
          </div>
          
          <div>
            <CustomTasksCard />
          </div>
        </div>
      </WorkLogDetailProvider>
      
      <DeleteWorkLogDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
      />
    </div>
  );
};

export default WorkLogDetail;
