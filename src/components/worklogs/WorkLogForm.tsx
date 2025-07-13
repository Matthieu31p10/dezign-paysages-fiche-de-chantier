
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
  isBlankWorksheet?: boolean;
}

const WorkLogForm: React.FC<WorkLogFormProps> = ({ 
  initialData, 
  onSuccess, 
  projectInfos, 
  existingWorkLogs,
  isBlankWorksheet = false
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
        <WorkLogFormSubmitHandler 
          onSuccess={onSuccess} 
          existingWorkLogId={initialData?.id}
          isBlankWorksheet={isBlankWorksheet}
        >
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-white p-3 rounded-md border border-green-100">
              <HeaderSection 
                teams={teams}
                filteredProjects={filteredProjects}
                handleTeamFilterChange={handleTeamFilterChange}
                handlePersonnelChange={handlePersonnelChange}
              />
            </div>
            
            <div className="bg-gradient-to-r from-white to-green-50 p-3 rounded-md border border-green-100">
              <TimeTrackingSection 
                previousYearsHours={previousYearsHours}
                currentYearTarget={currentYearTarget}
              />
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-3 rounded-md border border-green-100">
              <TasksSection />
            </div>
            
            <WasteManagementSection />
            
            {selectedProject && (
              <div className="bg-card p-3 rounded-md border border-border">
                <ProjectInfoSection />
              </div>
            )}
            
            <div className="bg-gradient-to-r from-white to-green-50 p-3 rounded-md border border-green-100">
              <NotesSection />
            </div>
            
            <ActionButtons 
              onCancel={handleCancel}
              isEditing={!!initialData}
              isBlankWorksheet={isBlankWorksheet}
            />
          </div>
        </WorkLogFormSubmitHandler>
      </WorkLogFormProvider>
    </FormProvider>
  );
};

export default WorkLogForm;
