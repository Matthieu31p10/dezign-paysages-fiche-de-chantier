
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
import ActionButtons from './form/ActionButtons';
import { WorkLogFormProvider } from './form/WorkLogFormContext';
import ProjectInfoSection from './form/ProjectInfoSection';
import WorkLogFormSubmitHandler from './form/WorkLogFormSubmitHandler';
import { useWorkLogFormState } from './form/useWorkLogForm';

interface WorkLogFormProps {
  initialData?: WorkLog;
  onSuccess?: () => void;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

const WorkLogForm: React.FC<WorkLogFormProps> = ({ 
  initialData, 
  onSuccess, 
  projectInfos, 
  existingWorkLogs 
}) => {
  const { teams } = useApp();
  
  const {
    form,
    selectedProject,
    filteredProjects,
    timeDeviation,
    timeDeviationClass,
    handlePersonnelChange,
    handleTeamFilterChange,
    handleCancel
  } = useWorkLogFormState({
    initialData,
    projectInfos,
    existingWorkLogs
  });
  
  return (
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
        <WorkLogFormSubmitHandler onSuccess={onSuccess}>
          <HeaderSection 
            teams={teams}
            filteredProjects={filteredProjects}
            handleTeamFilterChange={handleTeamFilterChange}
            handlePersonnelChange={handlePersonnelChange}
          />
          
          <Separator />
          
          <TimeTrackingSection />
          
          <Separator />
          
          <TasksSection />
          
          <Separator />
          
          <WasteManagementSection />
          
          <ProjectInfoSection />
          
          <NotesSection />
          
          <ActionButtons 
            onCancel={handleCancel}
            isEditing={!!initialData}
          />
        </WorkLogFormSubmitHandler>
      </WorkLogFormProvider>
    </FormProvider>
  );
};

export default WorkLogForm;
