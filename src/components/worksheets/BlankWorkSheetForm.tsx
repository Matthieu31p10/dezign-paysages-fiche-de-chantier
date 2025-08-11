
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Users } from 'lucide-react';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import DraftRecoveryDialog from '@/components/common/DraftRecoveryDialog';
import { useTemplates } from '@/hooks/useTemplates';
import { useProductivityShortcuts } from '@/hooks/useProductivityShortcuts';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { DuplicationMenu } from '@/components/worklogs/DuplicationMenu';

// Import schema and custom hooks
import { useFormInitialization } from './form/hooks/useFormInitialization';
import { useFormActions } from './form/hooks/useFormActions';
import { useWorksheetLoader } from './form/hooks/useWorksheetLoader';

// Import sections
import TimeTrackingSection from './TimeTrackingSection';
import TasksSection from './TasksSection';
import NotesSection from './form/AdditionalNotesSection';
import WasteManagementSection from './WasteManagementSection';
import FormActions from './form/FormActions';
import ClientInfoSection from './form/ClientInfoSection';
import ClientSignatureSection from './form/ClientSignatureSection';
import ConsumablesSection from './ConsumablesSection';
import FinancialSummarySection from './form/FinancialSummarySection';
import RecurringClientSection from './form/RecurringClientSection';
import WorksheetSummary from './WorksheetSummary';
import { useProjectLinkHook } from './form/useProjectLinkHook';
import ProjectLinkSection from './form/ProjectLinkSection';
import { useBlankWorksheetForm } from './form/useBlankWorksheetForm';
import { PersonnelSection } from './time-tracking/PersonnelSection';
import DocumentsSection from './form/DocumentsSection';

interface BlankWorkSheetFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos?: ProjectInfo[];
  existingWorkLogs?: WorkLog[];
  isBlankWorksheet?: boolean;
  editingWorkLogId?: string | null;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({
  initialData,
  onSuccess,
  projectInfos = [],
  existingWorkLogs = [],
  isBlankWorksheet = false,
  editingWorkLogId = null
}: BlankWorkSheetFormProps) => {
  const { teams } = useApp();
  const { workLogs } = useWorkLogs();
  const [activeTab, setActiveTab] = useState(initialData?.linkedProjectId ? 'project' : 'adhoc');
  
  const {
    form,
    selectedProjectId,
    selectedProject,
    handleProjectSelect,
    handleClearProject,
    isSubmitting,
    handleSubmit,
    handleCancel,
    autoSave,
    draftRecovery
  } = useBlankWorksheetForm({
    initialData,
    onSuccess,
    workLogs: existingWorkLogs || workLogs,
    projectInfos
  });

  // Templates et productivité
  const { worksheetTemplates, applyTemplate, deleteTemplate } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleApplyTemplate = (templateId: string) => {
    const templateData = applyTemplate(templateId, 'worksheet');
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
    if (initialData) {
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
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {initialData ? 'Modifier la fiche vierge' : 'Nouvelle fiche vierge'}
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
                  onDuplicate={(duplicated) => console.log('Fiche dupliquée:', duplicated)}
                />
              )}
            </div>
          </div>
          
          {showTemplateSelector && (
            <div className="border rounded-lg p-4 bg-muted/50 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Templates de fiches vierges</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowTemplateSelector(false)}>×</Button>
              </div>
              <TemplateSelector
                type="worksheet"
                templates={worksheetTemplates}
                onApplyTemplate={handleApplyTemplate}
                onDeleteTemplate={(id) => deleteTemplate(id, 'worksheet')}
                selectedTemplateId={selectedTemplateId}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="project" className="flex-1">
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Projet existant
                </TabsTrigger>
                <TabsTrigger value="adhoc" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Client ponctuel
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="project" className="mt-4">
                <ProjectLinkSection
                  selectedProjectId={selectedProjectId}
                  onProjectSelect={handleProjectSelect}
                  onClearProject={handleClearProject}
                  projectInfos={projectInfos}
                />
                
                {selectedProject && (
                  <Card className="p-4 mt-4 bg-slate-50">
                    <h3 className="text-sm font-medium mb-2">Informations client (depuis le projet)</h3>
                    <ClientInfoSection />
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="adhoc" className="mt-4">
                <RecurringClientSection />
              </TabsContent>
            </Tabs>
            
            <PersonnelSection 
              control={form.control}
              selectedPersonnel={form.watch('personnel') || []}
              onPersonnelChange={(personnel) => form.setValue('personnel', personnel, { shouldValidate: true, shouldDirty: true })}
            />
            
            <TimeTrackingSection />
            
            <TasksSection 
              customTasks={[]}
            />
            
                  <WasteManagementSection />
                  
                  <DocumentsSection isBlankWorksheet={true} />
                  
                  <ConsumablesSection />
                  
                  <Card className="p-4 border-green-200 bg-green-50">
                    <FinancialSummarySection />
                  </Card>
                  
                  <NotesSection />
            
            <ClientSignatureSection />
            
            <FormActions 
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              isEditing={!!initialData}
              isBlankWorksheet={isBlankWorksheet}
            />
          </div>
          
          <div className="md:col-span-1">
            <WorksheetSummary 
              formValues={form.watch()} 
              projectName={selectedProject?.name} 
            />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default BlankWorkSheetForm;
