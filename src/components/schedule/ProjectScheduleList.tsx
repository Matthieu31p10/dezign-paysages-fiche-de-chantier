import React, { useMemo, useState, useCallback } from 'react';
import { getDay } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './calendar/hooks/useYearlyPassageSchedule';
import { useProjectLocks } from './project-locks/hooks/useProjectLocks';
import TeamGroup from './project-schedule-list/components/TeamGroup';
import EmptyState from './project-schedule-list/components/EmptyState';
import LoadingSkeleton from './project-schedule-list/components/LoadingSkeleton';
import ErrorState from './project-schedule-list/components/ErrorState';
import ErrorBoundary from '@/components/ui/error-boundary';

interface ProjectScheduleListProps {
  selectedYear: number;
  selectedTeam: string;
}

interface ScheduledEvent {
  projectId: string;
  projectName: string;
  team: string;
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
  isLocked?: boolean;
}

interface TeamGroupData {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

const ProjectScheduleList: React.FC<ProjectScheduleListProps> = ({
  selectedYear,
  selectedTeam
}) => {
  const { projectInfos, teams } = useApp();
  const { isProjectLockedOnDay, isLoading: locksLoading, refreshLocks } = useProjectLocks();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Error | null>(null);

  const filteredProjects = useMemo(() => {
    try {
      return selectedTeam === 'all' 
        ? projectInfos.filter(p => !p.isArchived)
        : projectInfos.filter(p => p.team === selectedTeam && !p.isArchived);
    } catch (err) {
      console.error('Error filtering projects:', err);
      setError(err as Error);
      return [];
    }
  }, [projectInfos, selectedTeam]);

  const getYearlyPassageSchedule = useYearlyPassageSchedule(filteredProjects, selectedYear, true);

  const scheduledEvents = useMemo(() => {
    try {
      const events: ScheduledEvent[] = [];
      const yearlySchedule = getYearlyPassageSchedule(selectedYear);

      console.log('Generating scheduled events with lock checking...');

      filteredProjects.forEach(project => {
        const projectSchedule = yearlySchedule[project.id];
        if (projectSchedule) {
          Object.entries(projectSchedule).forEach(([date, passageNumber]) => {
            const dayOfWeek = getDay(new Date(date)) === 0 ? 7 : getDay(new Date(date));
            const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
            
            if (!isLocked) {
              events.push({
                projectId: project.id,
                projectName: project.name,
                team: project.team,
                date,
                passageNumber,
                totalPassages: project.annualVisits || 12,
                address: project.address,
                visitDuration: project.visitDuration,
                isLocked: false
              });
            } else {
              console.log(`Skipping locked event for ${project.name} on ${date} (day ${dayOfWeek})`);
            }
          });
        }
      });

      return events.sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      console.error('Error generating scheduled events:', err);
      setError(err as Error);
      return [];
    }
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear, isProjectLockedOnDay]);

  const groupedByTeam = useMemo(() => {
    const teamGroups: Record<string, TeamGroupData> = {};
    
    scheduledEvents.forEach(event => {
      const team = teams.find(t => t.id === event.team);
      const teamName = team ? team.name : 'Équipe inconnue';
      const teamColor = team ? team.color : '#6B7280';
      
      if (!teamGroups[event.team]) {
        teamGroups[event.team] = {
          teamId: event.team,
          teamName,
          teamColor,
          projects: {}
        };
      }
      
      if (!teamGroups[event.team].projects[event.projectId]) {
        teamGroups[event.team].projects[event.projectId] = [];
      }
      
      teamGroups[event.team].projects[event.projectId].push(event);
    });

    // Trier les projets dans chaque équipe par nom
    Object.values(teamGroups).forEach(teamGroup => {
      Object.keys(teamGroup.projects).forEach(projectId => {
        teamGroup.projects[projectId].sort((a, b) => a.date.localeCompare(b.date));
      });
    });

    return Object.values(teamGroups).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [scheduledEvents, teams]);

  const toggleTeamExpansion = useCallback((teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  }, []);

  const toggleProjectExpansion = useCallback((projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  }, []);

  const toggleAllProjects = useCallback((teamId: string, expand: boolean) => {
    const teamGroup = groupedByTeam.find(g => g.teamId === teamId);
    if (teamGroup) {
      const updates: Record<string, boolean> = {};
      Object.keys(teamGroup.projects).forEach(projectId => {
        updates[projectId] = expand;
      });
      setExpandedProjects(prev => ({ ...prev, ...updates }));
    }
  }, [groupedByTeam]);

  const handleRetry = useCallback(() => {
    setError(null);
    refreshLocks();
  }, [refreshLocks]);

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
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
            onToggleAllProjects={toggleAllProjects}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default ProjectScheduleList;
