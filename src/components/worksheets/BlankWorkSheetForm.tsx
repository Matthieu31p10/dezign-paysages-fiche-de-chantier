
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useApp } from '@/context/AppContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Separator } from '@/components/ui/separator';

// Import schema and sub-components
import HeaderSection from './form/HeaderSection';
import TimeTrackingSection from './form/TimeTrackingSection';
import TasksSection from './form/TasksSection';
import NotesSection from './form/NotesSection';
import WasteManagementSection from './form/WasteManagementSection';
import ActionButtons from './form/FormActions';
import ProjectInfoSection from './form/ProjectInfoSection';
import WorkLogFormSubmitHandler from './form/WorkLogFormSubmitHandler';
import { useWorkLogFormState } from './form/useWorkLogForm';
import ProjectLinkSection from './form/ProjectLinkSection';
import ClientInfoSection from './form/ClientInfoSection';
import InterventionDetailsSection from './form/InterventionDetailsSection';
import AdditionalNotesSection from './form/AdditionalNotesSection';
import FormActions from './form/FormActions';
import ClientSignatureSection from './form/ClientSignatureSection';
import ConsumablesSection from './ConsumablesSection';
import FinancialSummarySection from './form/FinancialSummarySection';
import RecurringClientSection from './form/RecurringClientSection';

interface BlankWorkSheetFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos?: ProjectInfo[];
  existingWorkLogs?: WorkLog[];
}

const BlankWorkSheetForm = ({
  initialData,
  onSuccess,
  projectInfos = [],
  existingWorkLogs = []
}: BlankWorkSheetFormProps) => {
  const { teams } = useApp();
  
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
  
  return (
    <FormProvider {...form}>
      <WorkLogFormSubmitHandler onSuccess={onSuccess}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="project" className="w-full">
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
                
                {selectedProjectId && (
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
            
            <InterventionDetailsSection />
            
            <TimeTrackingSection />
            
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
      </WorkLogFormSubmitHandler>
    </FormProvider>
  );
};

export default BlankWorkSheetForm;
