
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkLog } from '@/types/models';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export interface WorkLogDetailContextType {
  workLog: WorkLog | null;
  isLoading: boolean;
  project: any;
  timeDeviation: number;
  timeDeviationClass: string;
  handleEdit: () => void;
  handleDelete: () => void;
  handlePrint: () => void;
  handleExportPDF: () => void;
  handleReturn: () => void;
}

export const useWorkLogDetailProvider = (): WorkLogDetailContextType => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkLogById, deleteWorkLog } = useWorkLogs();
  const { getProjectById } = useApp();
  
  const [workLog, setWorkLog] = useState<WorkLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundWorkLog = getWorkLogById(id);
      setWorkLog(foundWorkLog || null);
    }
    setIsLoading(false);
  }, [id, getWorkLogById]);

  const project = workLog?.projectId ? getProjectById(workLog.projectId) : null;

  // Calculate time deviation
  const timeDeviation = workLog?.timeTracking?.totalHours && project?.visitDuration
    ? workLog.timeTracking.totalHours - project.visitDuration
    : 0;

  const timeDeviationClass = timeDeviation > 0 
    ? 'text-red-600' 
    : timeDeviation < 0 
    ? 'text-orange-600' 
    : 'text-green-600';

  const handleEdit = () => {
    navigate(`/worklogs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!workLog || !id) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche de suivi ?')) {
      try {
        await deleteWorkLog(id);
        toast.success('Fiche de suivi supprimée avec succès');
        navigate('/worklogs');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la fiche');
      }
    }
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log('Print worklog:', workLog);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Export PDF for worklog:', workLog);
  };

  const handleReturn = () => {
    navigate('/worklogs');
  };

  return {
    workLog,
    isLoading,
    project,
    timeDeviation,
    timeDeviationClass,
    handleEdit,
    handleDelete,
    handlePrint,
    handleExportPDF,
    handleReturn
  };
};
