import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ProjectInfo, WorkLog } from '@/types/models';
import { WorkLogFormProvider } from './WorkLogFormContext';
import WorkLogFormSubmitHandler from './WorkLogFormSubmitHandler';
import { useWorkLogFormState } from './useWorkLogForm';

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
          {children}
        </WorkLogFormSubmitHandler>
      </WorkLogFormProvider>
    </FormProvider>
  );
};

export default WorkLogFormContainer;