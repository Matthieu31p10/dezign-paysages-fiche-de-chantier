
import React, { useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './calendar/hooks/useYearlyPassageSchedule';
import { useProjectLocks } from './project-locks/hooks/useProjectLocks';
import { useScheduledEvents } from './project-schedule-list/hooks/useScheduledEvents';
import { useTeamGroups } from './project-schedule-list/hooks/useTeamGroups';
import { useExpansionState } from './project-schedule-list/hooks/useExpansionState';
import TeamGroup from './project-schedule-list/components/TeamGroup';
import EmptyState from './project-schedule-list/components/EmptyState';
import LoadingSkeleton from './project-schedule-list/components/LoadingSkeleton';
import ErrorState from './project-schedule-list/components/ErrorState';
import ErrorBoundary from '@/components/ui/error-boundary';

interface ProjectScheduleListProps {
  selectedYear: number;
  selectedTeam: string;
}

const ProjectScheduleList: React.FC<ProjectScheduleListProps> = ({
  selectedYear,
  selectedTeam
}) => {
  const { projectInfos, teams } = useApp();
  const { 
    isProjectLockedOnDay, 
    getProjectLockDetails,
    isLoading: locksLoading, 
    refreshLocks, 
    error: locksError 
  } = useProjectLocks();
  
  const {
    expandedTeams,
    expandedProjects,
    toggleTeamExpansion,
    toggleProjectExpansion,
    toggleAllProjects,
  } = useExpansionState();

  const filteredProjects = useMemo(() => {
    return selectedTeam === 'all' 
      ? projectInfos.filter(p => !p.isArchived)
      : projectInfos.filter(p => p.team === selectedTeam && !p.isArchived);
  }, [projectInfos, selectedTeam]);

  // Pass both lock checking functions to useYearlyPassageSchedule
  const getYearlyPassageSchedule = useYearlyPassageSchedule(
    filteredProjects, 
    selectedYear, 
    true, 
    isProjectLockedOnDay,
    getProjectLockDetails
  );

  const scheduledEvents = useScheduledEvents(
    filteredProjects,
    getYearlyPassageSchedule,
    selectedYear,
    isProjectLockedOnDay
  );

  const groupedByTeam = useTeamGroups(scheduledEvents, teams);

  const handleToggleAllProjects = useCallback((teamId: string, expand: boolean) => {
    toggleAllProjects(teamId, expand, groupedByTeam);
  }, [toggleAllProjects, groupedByTeam]);

  const handleRetry = useCallback(() => {
    refreshLocks();
  }, [refreshLocks]);

  if (locksError) {
    return <ErrorState error={new Error(locksError)} onRetry={handleRetry} />;
  }

  if (locksLoading) {
    return <LoadingSkeleton />;
  }

  if (groupedByTeam.length === 0) {
    return <EmptyState />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {groupedByTeam.map((teamGroup) => (
          <TeamGroup
            key={teamGroup.teamId}
            teamId={teamGroup.teamId}
            teamName={teamGroup.teamName}
            teamColor={teamGroup.teamColor}
            projects={teamGroup.projects}
            filteredProjects={filteredProjects}
            expandedProjects={expandedProjects}
            isExpanded={expandedTeams[teamGroup.teamId] ?? true}
            onToggleExpansion={toggleTeamExpansion}
            onToggleProject={toggleProjectExpansion}
            onToggleAllProjects={handleToggleAllProjects}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default ProjectScheduleList;
