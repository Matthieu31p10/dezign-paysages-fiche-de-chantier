
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileBarChart, Users } from 'lucide-react';

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
import WorkLogFormSubmitHandler from './form/WorkLogFormSubmitHandler';
import WorksheetSummary from './WorksheetSummary';
import { useProjectLinkHook } from './form/useProjectLinkHook';
import ProjectLinkSection from './form/ProjectLinkSection';
import { useBlankWorksheetForm } from './form/useBlankWorksheetForm';

interface BlankWorkSheetFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos?: ProjectInfo[];
  existingWorkLogs?: WorkLog[];
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({
  initialData,
  onSuccess,
  projectInfos = [],
  existingWorkLogs = []
}: BlankWorkSheetFormProps) => {
  const { teams } = useApp();
  const { workLogs } = useWorkLogs();
  const [activeTab, setActiveTab] = useState(initialData?.linkedProjectId ? 'project' : 'adhoc');
  
  // Utiliser le hook useBlankWorksheetForm pour gérer le formulaire
  const {
    form,
    selectedProjectId,
    selectedProject,
    handleProjectSelect,
    handleClearProject,
    isSubmitting,
    handleSubmit,
    handleCancel
  } = useBlankWorksheetForm({
    initialData,
    onSuccess,
    workLogs: existingWorkLogs || workLogs,
    projectInfos
  });
  
  return (
    <FormProvider {...form}>
      <WorkLogFormSubmitHandler onSuccess={onSuccess}>
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
            
            <TimeTrackingSection />
            
            <TasksSection 
              customTasks={[]} // We'll implement this later
            />
            
            <WasteManagementSection />
            
            <ConsumablesSection />
            
            <FinancialSummarySection />
            
            <NotesSection />
            
            <ClientSignatureSection />
            
            <FormActions 
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              isEditing={!!initialData}
              handleCancel={handleCancel}
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
