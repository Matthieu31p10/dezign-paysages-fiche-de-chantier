
import { useState, useTransition } from 'react';
import { useApp } from '@/context/AppContext';
import { getDaysSinceLastEntry } from '@/utils/helpers';
import ProjectGridView from '@/components/reports/ProjectGridView';
import ProjectReportList from '@/components/reports/ProjectReportList';
import ProjectFilters from '@/components/reports/ProjectFilters';
import EmptyProjectsState from '@/components/reports/EmptyProjectsState';

const ProjectsTab = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [isPending, startTransition] = useTransition();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [viewMode, setViewMode] = useState<string>('grid');
  
  // Safety checks for data
  const validProjectInfos = Array.isArray(projectInfos) ? projectInfos : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];
  
  // Filter projects by team
  const filteredProjects = selectedTeam === 'all'
    ? validProjectInfos
    : validProjectInfos.filter(project => project.team === selectedTeam);
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'lastVisit') {
      const logsA = validWorkLogs.filter(log => log.projectId === a.id);
      const logsB = validWorkLogs.filter(log => log.projectId === b.id);
      
      const daysA = getDaysSinceLastEntry(logsA) || Number.MAX_SAFE_INTEGER;
      const daysB = getDaysSinceLastEntry(logsB) || Number.MAX_SAFE_INTEGER;
      
      return daysA - daysB;
    }
    return 0;
  });

  // Handlers with startTransition
  const handleTeamChange = (value: string) => {
    startTransition(() => {
      setSelectedTeam(value);
    });
  };

  const handleSortChange = (value: string) => {
    startTransition(() => {
      setSortOption(value);
    });
  };

  const handleViewModeChange = (value: string) => {
    if (value) {
      startTransition(() => {
        setViewMode(value);
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <ProjectFilters
        teams={validTeams}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      
      {filteredProjects.length === 0 ? (
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
