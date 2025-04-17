
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
          <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-md mb-4">
            <HeaderSection 
              teams={teams}
              filteredProjects={filteredProjects}
              handleTeamFilterChange={handleTeamFilterChange}
              handlePersonnelChange={handlePersonnelChange}
            />
          </div>
          
          <Separator className="my-6 bg-green-200" />
          
          <div className="bg-gradient-to-r from-white to-green-50 p-4 rounded-md mb-4">
            <TimeTrackingSection 
              previousYearsHours={previousYearsHours}
              currentYearTarget={currentYearTarget}
            />
          </div>
          
          <Separator className="my-6 bg-green-200" />
          
          <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-md mb-4">
            <TasksSection />
          </div>
          
          <Separator className="my-6 bg-green-200" />
          
          <WasteManagementSection />
          
          <div className="mt-6 bg-white p-4 rounded-md border border-green-100">
            <ProjectInfoSection />
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-white to-green-50 p-4 rounded-md">
            <NotesSection />
          </div>
          
          <div className="mt-8">
            <ActionButtons 
              onCancel={handleCancel}
              isEditing={!!initialData}
            />
          </div>
        </WorkLogFormSubmitHandler>
      </WorkLogFormProvider>
    </FormProvider>
  );
};

export default WorkLogForm;
