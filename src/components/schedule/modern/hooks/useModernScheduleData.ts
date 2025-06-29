
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from '../../calendar/hooks/useYearlyPassageSchedule';
import { useProjectLocks } from '../../project-locks/hooks/useProjectLocks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, getDay } from 'date-fns';

interface ScheduledEvent {
  id: string;
  projectId: string;
  projectName: string;
  teams: string[];
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
  isLocked?: boolean;
}

interface TeamGroup {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

interface UseModernScheduleDataProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeams: string[];
  showWeekends: boolean;
}

export const useModernScheduleData = ({
  selectedMonth,
  selectedYear,
  selectedTeams,
  showWeekends
}: UseModernScheduleDataProps) => {
  const { projectInfos, teams } = useApp();
  const { isProjectLockedOnDay, getProjectLockDetails } = useProjectLocks();

  // Filter projects based on selected teams and status
  const filteredProjects = useMemo(() => {
    let projects = projectInfos.filter(p => !p.isArchived);
    
    if (!selectedTeams.includes('all')) {
      projects = projects.filter(project => {
        // Check if project has any of the selected teams
        const projectTeams = project.teams?.map(t => t.id) || [project.team];
        return selectedTeams.some(teamId => projectTeams.includes(teamId));
      });
    }
    
    return projects;
  }, [projectInfos, selectedTeams]);

  // Generate yearly schedule with multi-team support
  const getYearlyPassageSchedule = useYearlyPassageSchedule(
    filteredProjects,
    selectedYear,
    showWeekends,
    isProjectLockedOnDay,
    getProjectLockDetails
  );

  // Generate scheduled events
  const scheduledEvents = useMemo(() => {
    try {
      const events: ScheduledEvent[] = [];
      const yearlySchedule = getYearlyPassageSchedule(selectedYear);

      filteredProjects.forEach(project => {
        const projectSchedule = yearlySchedule[project.id];
        if (projectSchedule) {
          Object.entries(projectSchedule).forEach(([date, passageNumber]) => {
            const dayOfWeek = getDay(new Date(date)) === 0 ? 7 : getDay(new Date(date));
            const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
            
            if (!isLocked) {
              // Support for multiple teams
              const projectTeams = project.teams?.map(t => t.id) || [project.team];
              
              events.push({
                id: `${project.id}-${date}`,
                projectId: project.id,
                projectName: project.name,
                teams: projectTeams,
                date,
                passageNumber,
                totalPassages: project.annualVisits || 12,
                address: project.address,
                visitDuration: project.visitDuration,
                isLocked: false
              });
            }
          });
        }
      });

      return events.sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      console.error('Error generating scheduled events:', err);
      return [];
    }
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear, isProjectLockedOnDay]);

  // Group events by team
  const teamGroups = useMemo(() => {
    const groups: Record<string, TeamGroup> = {};
    
    scheduledEvents.forEach(event => {
      event.teams.forEach(teamId => {
        const team = teams.find(t => t.id === teamId);
        const teamName = team ? team.name : 'Équipe inconnue';
        const teamColor = team ? team.color : '#6B7280';
        
        if (!groups[teamId]) {
          groups[teamId] = {
            teamId,
            teamName,
            teamColor,
            projects: {}
          };
        }
        
        if (!groups[teamId].projects[event.projectId]) {
          groups[teamId].projects[event.projectId] = [];
        }
        
        groups[teamId].projects[event.projectId].push(event);
      });
    });

    // Sort events within each project
    Object.values(groups).forEach(group => {
      Object.keys(group.projects).forEach(projectId => {
        group.projects[projectId].sort((a, b) => a.date.localeCompare(b.date));
      });
    });

    return Object.values(groups).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [scheduledEvents, teams]);

  return {
    filteredProjects,
    scheduledEvents,
    teamGroups,
    isLoading: false // TODO: Add proper loading state
  };
};
