
import React from 'react';
import { WorkLog } from '@/types/models';
import WorksheetSummary from './WorksheetSummary';
import ProjectLinkSection from './form/ProjectLinkSection';
import ClientInfoSection from './form/ClientInfoSection';
import InterventionDetailsSection from './form/InterventionDetailsSection';
import AdditionalNotesSection from './form/AdditionalNotesSection';
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
import TimeTrackingSection from './TimeTrackingSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileBarChart, Users } from 'lucide-react';

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
    handleClearProject
  } = formMethods;
  
  const { settings } = useApp();
  
  return (
    <FormProvider {...form}>
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
              
              {/* Si un projet est sélectionné, afficher quand même les informations du client pour référence */}
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
    </FormProvider>
  );
};

export default BlankWorkSheetForm;
