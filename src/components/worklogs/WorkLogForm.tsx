
import React from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import WorkLogFormContainer from './form/WorkLogFormContainer';
import WorkLogFormSections from './form/WorkLogFormSections';
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
  const {
    selectedProject,
    filteredProjects,
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
    <WorkLogFormContainer
      initialData={initialData}
      onSuccess={onSuccess}
      projectInfos={projectInfos}
      existingWorkLogs={existingWorkLogs}
      isBlankWorksheet={isBlankWorksheet}
    >
      <WorkLogFormSections
        filteredProjects={filteredProjects}
        handleTeamFilterChange={handleTeamFilterChange}
        handlePersonnelChange={handlePersonnelChange}
        handleCancel={handleCancel}
        selectedProject={selectedProject}
        previousYearsHours={previousYearsHours}
        currentYearTarget={currentYearTarget}
        isEditing={!!initialData}
        isBlankWorksheet={isBlankWorksheet}
      />
    </WorkLogFormContainer>
  );
};

export default WorkLogForm;
