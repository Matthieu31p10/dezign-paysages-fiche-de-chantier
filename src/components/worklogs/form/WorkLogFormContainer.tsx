import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ProjectInfo, WorkLog } from '@/types/models';
import { WorkLogFormProvider } from './WorkLogFormContext';
import WorkLogFormSubmitHandler from './WorkLogFormSubmitHandler';
import { useWorkLogFormState } from './useWorkLogForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useDraftRecovery } from '@/hooks/useDraftRecovery';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import DraftRecoveryDialog from '@/components/common/DraftRecoveryDialog';

interface WorkLogFormContainerProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
  isBlankWorksheet?: boolean;
  children: React.ReactNode;
}

const WorkLogFormContainer: React.FC<WorkLogFormContainerProps> = ({ 
  initialData, 
  onSuccess, 
  projectInfos, 
  existingWorkLogs,
  isBlankWorksheet = false,
  children
}) => {
  const {
    form,
    selectedProject,
    filteredProjects,
    timeDeviation,
    timeDeviationClass,
    handlePersonnelChange,
    handleTeamFilterChange,
    handleCancel,
    previousYearsHours,
    currentYearTarget
  } = useWorkLogFormState({
    initialData,
    projectInfos,
    existingWorkLogs
  });

  // Auto-save pour les fiches de travail
  const storageKey = `worklog-draft-${initialData?.id || 'new'}`;
  const autoSave = useAutoSave(form, {
    storageKey,
    enabled: true,
    interval: 10000 // 10 secondes
  });

  // Récupération automatique des brouillons
  const draftRecovery = useDraftRecovery({
    storageKey,
    onRestore: (data) => {
      form.reset(data);
    }
  });
  
  return (
    <>
      <DraftRecoveryDialog
        isOpen={draftRecovery.showRecoveryDialog}
        onRestore={draftRecovery.restoreDraft}
        onDismiss={draftRecovery.dismissDraft}
        draftAge={draftRecovery.formatDraftAge()}
      />
      
      <FormProvider {...form}>
        <WorkLogFormProvider
          form={form}
          initialData={initialData}
          projectInfos={projectInfos}
          existingWorkLogs={existingWorkLogs}
          selectedProject={selectedProject}
          timeDeviation={timeDeviation}
          timeDeviationClass={timeDeviationClass}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {initialData ? 'Modifier la fiche' : 'Nouvelle fiche'}
              </h2>
              <AutoSaveIndicator
                lastSaved={autoSave.lastSaved}
                isSaving={autoSave.isSaving}
                hasUnsavedChanges={autoSave.hasUnsavedChanges}
              />
            </div>
            
            <WorkLogFormSubmitHandler 
              onSuccess={() => {
                autoSave.clearDraft();
                onSuccess?.();
              }} 
              existingWorkLogId={initialData?.id}
              isBlankWorksheet={isBlankWorksheet}
            >
              {children}
            </WorkLogFormSubmitHandler>
          </div>
        </WorkLogFormProvider>
      </FormProvider>
    </>
  );
};

export default WorkLogFormContainer;