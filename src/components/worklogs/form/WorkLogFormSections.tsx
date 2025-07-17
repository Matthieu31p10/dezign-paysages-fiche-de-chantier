import React from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectInfo } from '@/types/models';
import HeaderSection from './HeaderSection';
import TimeTrackingSection from './TimeTrackingSection';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import WasteManagementSection from './WasteManagementSection';
import ActionButtons from './ActionButtons';
import ProjectInfoSection from './ProjectInfoSection';

interface WorkLogFormSectionsProps {
  filteredProjects: ProjectInfo[];
  handleTeamFilterChange: (teamId: string) => void;
  handlePersonnelChange: (personnel: string[]) => void;
  handleCancel: () => void;
  selectedProject: ProjectInfo | null;
  previousYearsHours: number;
  currentYearTarget: number;
  isEditing: boolean;
  isBlankWorksheet: boolean;
}

const WorkLogFormSections: React.FC<WorkLogFormSectionsProps> = ({
  filteredProjects,
  handleTeamFilterChange,
  handlePersonnelChange,
  handleCancel,
  selectedProject,
  previousYearsHours,
  currentYearTarget,
  isEditing,
  isBlankWorksheet
}) => {
  const { teams } = useApp();

  return (
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
        isEditing={isEditing}
        isBlankWorksheet={isBlankWorksheet}
      />
    </div>
  );
};

export default WorkLogFormSections;