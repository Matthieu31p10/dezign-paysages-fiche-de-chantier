import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ProjectInfo, WorkLog } from '@/types/models';
import { WorkLogFormProvider } from './WorkLogFormContext';
import WorkLogFormSubmitHandler from './WorkLogFormSubmitHandler';
import { useWorkLogFormState } from './useWorkLogForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useDraftRecovery } from '@/hooks/useDraftRecovery';
import { useTemplates } from '@/hooks/useTemplates';
import { useProductivityShortcuts } from '@/hooks/useProductivityShortcuts';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import DraftRecoveryDialog from '@/components/common/DraftRecoveryDialog';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { DuplicationMenu } from '@/components/worklogs/DuplicationMenu';
import { Button } from '@/components/ui/button';

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

  // Templates et productivité
  const { workLogTemplates, applyTemplate, deleteTemplate } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleApplyTemplate = (templateId: string) => {
    const templateData = applyTemplate(templateId, 'worklog');
    if (templateData) {
      Object.entries(templateData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as any, value);
        }
      });
      setSelectedTemplateId(templateId);
    }
  };

  const handleDuplicate = () => {
    // Cette fonction sera appelée par le raccourci clavier
    if (initialData) {
      // Logic de duplication sera gérée par le parent
      console.log('Duplication demandée pour:', initialData.id);
    }
  };

  // Raccourcis clavier
  useProductivityShortcuts({
    onSave: () => form.handleSubmit(() => {})(),
    onDuplicate: handleDuplicate,
    onTemplateMenu: () => setShowTemplateSelector(!showTemplateSelector),
    enabled: true
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
              <div className="flex items-center gap-2">
                <AutoSaveIndicator
                  lastSaved={autoSave.lastSaved}
                  isSaving={autoSave.isSaving}
                  hasUnsavedChanges={autoSave.hasUnsavedChanges}
                />
                {initialData && (
                  <DuplicationMenu 
                    workLog={initialData}
                    onDuplicate={(duplicated) => {
                      // Sera géré par le parent
                      console.log('Fiche dupliquée:', duplicated);
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Templates Section */}
            {showTemplateSelector && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Templates de fiches</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowTemplateSelector(false)}
                  >
                    ×
                  </Button>
                </div>
                <TemplateSelector
                  type="worklog"
                  templates={workLogTemplates}
                  onApplyTemplate={handleApplyTemplate}
                  onDeleteTemplate={(id) => deleteTemplate(id, 'worklog')}
                  selectedTemplateId={selectedTemplateId}
                />
              </div>
            )}
            
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