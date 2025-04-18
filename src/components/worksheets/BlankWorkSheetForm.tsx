
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useApp } from '@/context/AppContext';
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
import TimeTrackingFormSection from './form/TimeTrackingFormSection';
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
  const [activeTab, setActiveTab] = useState('adhoc'); // Default to 'adhoc' for client form
  
  // Initialize form
  const form = useFormInitialization({ initialData });
  
  // Project selection hooks
  const { 
    selectedProject,
    selectedProjectId,
    handleProjectSelect,
    handleClearProject
  } = useProjectLinkHook({ form, projectInfos });
  
  // Form actions (submit, cancel)
  const {
    isSubmitting,
    handleSubmit,
    handleCancel
  } = useFormActions({
    form,
    workLogId: initialData?.id,
    onSuccess,
    workLogs: existingWorkLogs,
    handleClearProject
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
            
            <TimeTrackingFormSection />
            
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
