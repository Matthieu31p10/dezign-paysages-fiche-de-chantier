
import React from 'react';
import { WorkLog } from '@/types/models';
import WorksheetSummary from './WorksheetSummary';
import ProjectLinkSection from './form/ProjectLinkSection';
import ClientInfoSection from './form/ClientInfoSection';
import InterventionDetailsSection from './form/InterventionDetailsSection';
import AdditionalNotesSection from './form/AdditionalNotesSection';
import TimeTrackingFormSection from './form/TimeTrackingFormSection';
import FormActions from './form/FormActions';
import { useBlankWorksheetForm } from './form/useBlankWorksheetForm';
import { FormProvider } from 'react-hook-form';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext';
import TasksSection from './TasksSection';
import WasteManagementSection from './WasteManagementSection';
import ClientSignatureSection from './form/ClientSignatureSection';
import ConsumablesSection from './ConsumablesSection';
import FinancialSummarySection from './form/FinancialSummarySection';
import RecurringClientSection from './form/RecurringClientSection';

interface BlankWorkSheetFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos?: any[];
  existingWorkLogs?: WorkLog[];
}

const BlankWorkSheetForm = ({
  initialData,
  onSuccess,
  projectInfos = [],
  existingWorkLogs = []
}: BlankWorkSheetFormProps) => {
  const { workLogs: contextWorkLogs } = useWorkLogs();
  
  // Initialize the form with our custom hook
  const formMethods = useBlankWorksheetForm({
    initialData,
    onSuccess,
    workLogs: existingWorkLogs.length ? existingWorkLogs : contextWorkLogs,
    projectInfos
  });
  
  // Extract what we need from the form methods
  const {
    form,
    handleSubmit,
    handleCancel,
    isSubmitting,
    selectedProjectId,
    selectedProject,
    handleProjectSelect,
    handleClearProject,
    calculateTotalHours
  } = formMethods;
  
  const { settings } = useApp();
  
  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <ProjectLinkSection
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
            onClearProject={handleClearProject}
            projectInfos={projectInfos}
          />
          
          <RecurringClientSection />
          
          <ClientInfoSection />
          
          <InterventionDetailsSection />
          
          <TimeTrackingFormSection 
            onTimeChange={calculateTotalHours}
          />
          
          <TasksSection 
            customTasks={settings?.customTasks || []}
          />
          
          <WasteManagementSection />
          
          <ConsumablesSection />
          
          <FinancialSummarySection />
          
          <AdditionalNotesSection />
          
          <ClientSignatureSection />
          
          <FormActions 
            isSubmitting={isSubmitting}
            handleCancel={handleCancel}
            isEditing={!!initialData}
          />
        </div>
        
        <div className="md:col-span-1">
          <WorksheetSummary 
            formValues={form.watch()} 
            projectName={selectedProject?.name} 
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default BlankWorkSheetForm;
