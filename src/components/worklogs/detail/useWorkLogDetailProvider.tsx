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
  isEditable: boolean;
  handleExportToPDF: () => void;
  isExporting: boolean;
  notes: string;
  setNotes: (value: string) => void;
  handleSaveNotes: () => void;
  calculateEndTime: () => string;
  calculateHourDifference: () => number;
  calculateTotalTeamHours: () => number;
  confirmDelete: () => void;
  handleDeleteWorkLog: () => void;
  handleSendEmail: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  isBlankWorksheet: boolean;
}

export const useWorkLogDetailProvider = (): WorkLogDetailContextType => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkLogById, deleteWorkLog } = useWorkLogs();
  const { getProjectById } = useApp();
  
  const [workLog, setWorkLog] = useState<WorkLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const isEditable = true;
  const handleExportToPDF = async () => {};
  const isExporting = false;
  const handleSaveNotes = () => {};
  const calculateEndTime = () => '';
  const calculateHourDifference = () => 0;
  const calculateTotalTeamHours = () => 0;
  const confirmDelete = () => setIsDeleteDialogOpen(true);
  const handleSendEmail = () => {};

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
    handleReturn,
    isEditable,
    handleExportToPDF,
    isExporting,
    notes,
    setNotes,
    handleSaveNotes,
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours,
    confirmDelete,
    handleDeleteWorkLog: handleDelete,
    handleSendEmail,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isBlankWorksheet: false,
  };
};
