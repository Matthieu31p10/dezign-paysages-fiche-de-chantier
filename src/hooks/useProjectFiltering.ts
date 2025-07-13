
import { useMemo, useState, useTransition } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { getDaysSinceLastEntry } from '@/utils/date-helpers';

export const useProjectFiltering = (projectInfos: ProjectInfo[], workLogs: WorkLog[]) => {
  const [isPending, startTransition] = useTransition();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [viewMode, setViewMode] = useState<string>('grid');
  
  // Get unique project types
  const projectTypes = useMemo(() => {
    const types = projectInfos
      .map(project => project.projectType)
      .filter(Boolean) as string[];
    return [...new Set(types)];
  }, [projectInfos]);

  // Filter projects by team and type
  const filteredProjects = useMemo(() => {
    return projectInfos.filter(project => {
      const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
      const matchesType = selectedProjectType === 'all' || project.projectType === selectedProjectType;
      return matchesTeam && matchesType;
    });
  }, [projectInfos, selectedTeam, selectedProjectType]);
  
  // Sort projects
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'lastVisit') {
        const logsA = workLogs.filter(log => log.projectId === a.id);
        const logsB = workLogs.filter(log => log.projectId === b.id);
        
        // Fix: use correct types with getDaysSinceLastEntry
        const daysA = getDaysSinceLastEntry(logsA);
        const daysB = getDaysSinceLastEntry(logsB);
        
        // Make sure daysA and daysB are numbers before the operation
        const numDaysA = typeof daysA === 'number' ? daysA : Number.MAX_SAFE_INTEGER;
        const numDaysB = typeof daysB === 'number' ? daysB : Number.MAX_SAFE_INTEGER;
        
        return numDaysA - numDaysB;
      }
      return 0;
    });
  }, [filteredProjects, sortOption, workLogs]);

  // Handlers with startTransition
  const handleTeamChange = (value: string) => {
    startTransition(() => {
      setSelectedTeam(value);
    });
  };

  const handleProjectTypeChange = (value: string) => {
    startTransition(() => {
      setSelectedProjectType(value);
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
  
  return {
    isPending,
    selectedTeam,
    selectedProjectType,
    sortOption,
    viewMode,
    projectTypes,
    filteredProjects,
    sortedProjects,
    handleTeamChange,
    handleProjectTypeChange,
    handleSortChange,
    handleViewModeChange
  };
};
