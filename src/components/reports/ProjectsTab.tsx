
import { useApp } from '@/context/AppContext';
import ProjectGridView from '@/components/reports/ProjectGridView';
import ProjectReportList from '@/components/reports/ProjectReportList';
import ProjectFilters from '@/components/reports/ProjectFilters';
import EmptyProjectsState from '@/components/reports/EmptyProjectsState';
import TeamTotalsTable from '@/components/reports/TeamTotalsTable';
import { useProjectFiltering } from '@/hooks/useProjectFiltering';

const ProjectsTab = () => {
  const { projectInfos, workLogs, teams } = useApp();
  
  // Safety checks for data
  const validProjectInfos = Array.isArray(projectInfos) ? projectInfos : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];
  
  // Use our custom hook for filtering and sorting
  const {
    selectedTeam,
    selectedProjectType,
    sortOption,
    viewMode,
    projectTypes,
    sortedProjects,
    handleTeamChange,
    handleProjectTypeChange,
    handleSortChange,
    handleViewModeChange
  } = useProjectFiltering(validProjectInfos, validWorkLogs);
  
  return (
    <div className="space-y-6">
      <ProjectFilters
        teams={validTeams}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        projectTypes={projectTypes}
        selectedProjectType={selectedProjectType}
        onProjectTypeChange={handleProjectTypeChange}
      />
      
      {/* Résumé par équipe */}
      <TeamTotalsTable 
        teams={validTeams} 
        projectInfos={validProjectInfos} 
        workLogs={validWorkLogs} 
      />
      
      {sortedProjects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        viewMode === 'grid' ? (
          <ProjectGridView
            projects={sortedProjects}
            workLogs={validWorkLogs}
            teams={validTeams}
          />
        ) : (
          <ProjectReportList
            projects={sortedProjects}
            workLogs={validWorkLogs}
            teams={validTeams}
          />
        )
      )}
    </div>
  );
};

export default ProjectsTab;
