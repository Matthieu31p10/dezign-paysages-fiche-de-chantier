
import { useState, useCallback } from 'react';
import { WorkLog, ProjectInfo, AppSettings } from '@/types/models';
import { PDFOptions } from './WorkLogDetailContext';
import { usePDFExport } from './utils/usePDFExport';
import { useWorkLogActions } from './utils/useWorkLogActions';
import { useWorkLogCalculations } from './utils/useWorkLogCalculations';

export const useWorkLogDetailProvider = (
  workLog: WorkLog | undefined,
  project: ProjectInfo | undefined,
  workLogs: WorkLog[],
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => Promise<void>,
  deleteWorkLog: (id: string) => Promise<void>,
  settings: AppSettings
) => {
  const [notes, setNotes] = useState(workLog?.notes || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { handleExportToPDF, isExporting } = usePDFExport(workLog, project, settings);
  const { handleSaveNotes, handleDeleteWorkLog, handleSendEmail, confirmDelete } = useWorkLogActions(
    workLog,
    notes,
    updateWorkLog,
    deleteWorkLog,
    setIsDeleteDialogOpen
  );
  
  const { calculateEndTime, calculateHourDifference, calculateTotalTeamHours } = useWorkLogCalculations(
    workLog,
    project,
    workLogs
  );

  const isEditable = true;
  const isBlankWorksheet = workLog?.projectId?.startsWith('blank-') || workLog?.projectId?.startsWith('DZFV') || false;

  return {
    workLog: workLog || null,
    project: project || null,
    workLogs, // Ajout de la propriété manquante
    isLoading: false,
    isEditable,
    handleExportToPDF,
    isExporting,
    notes,
    setNotes,
    handleSaveNotes,
    calculateEndTime: () => calculateEndTime(),
    calculateHourDifference: () => Number(calculateHourDifference().replace(/[^\d.-]/g, '') || 0),
    calculateTotalTeamHours: () => Number(calculateTotalTeamHours()),
    confirmDelete,
    handleDeleteWorkLog,
    handleSendEmail,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isBlankWorksheet,
  };
};
