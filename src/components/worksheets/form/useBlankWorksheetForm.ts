
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { BlankWorkSheetValues } from '../schema';
import { useProjectLink } from './useProjectLinkHook';
import { useFormInitialization } from './hooks/useFormInitialization';
import { useTimeCalculation } from './hooks/useTimeCalculation';
import { useWorksheetLoader } from './hooks/useWorksheetLoader';
import { useFormActions } from './hooks/useFormActions';

/**
 * Main hook for managing blank worksheet form
 */
export const useBlankWorksheetForm = (
  onSuccess?: () => void, 
  workLogId?: string | null, 
  workLogs?: WorkLog[]
) => {
  const { addWorkLog, updateWorkLog, getWorkLogById } = useApp();
  const workLogsContext = useWorkLogs();
  
  // Initialize form with default values
  const form = useFormInitialization();
  
  // Set up project linking functionality
  const projectLinkHook = useProjectLink(form);
  
  // Set up automatic time calculation
  useTimeCalculation(form);
  
  // Set up form actions (submit, reset, etc.)
  const formActions = useFormActions({
    form,
    addWorkLog,
    updateWorkLog,
    workLogId,
    onSuccess,
    workLogs,
    handleClearProject: projectLinkHook.handleClearProject
  });
  
  // Set up data loading for editing existing worksheets
  const { loadWorkLogData } = useWorksheetLoader({
    form,
    getWorkLogById,
    handleProjectSelect: projectLinkHook.handleProjectSelect
  });
  
  // Return all hooks and functions needed by components
  return {
    form,
    ...projectLinkHook,
    ...formActions,
    loadWorkLogData
  };
};

// Add missing type import
import { WorkLog } from '@/types/models';
