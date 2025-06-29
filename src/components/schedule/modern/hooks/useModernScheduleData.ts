
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from '../../calendar/hooks/useYearlyPassageSchedule';
import { useProjectLocks } from '../../project-locks/hooks/useProjectLocks';
import { useProjectTeams } from '@/hooks/useProjectTeams';
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
  const { projectTeams } = useProjectTeams();
  const { isProjectLockedOnDay, getProjectLockDetails } = useProjectLocks();

  // Enhanced project filtering with multi-team support
  const filteredProjects = useMemo(() => {
    let projects = projectInfos.filter(p => !p.isArchived);
    
    if (!selectedTeams.includes('all')) {
      projects = projects.filter(project => {
        // Get all teams assigned to this project
        const projectTeamAssignments = projectTeams.filter(pt => pt.projectId === project.id);
        
        if (projectTeamAssignments.length > 0) {
          // Check if any of the project's teams are in selected teams
          return projectTeamAssignments.some(pt => selectedTeams.includes(pt.teamId));
        } else {
          // Fallback to legacy team field if no team assignments exist
          return project.team && selectedTeams.includes(project.team);
        }
      });
    }
    
    return projects;
  }, [projectInfos, selectedTeams, projectTeams]);

  // Generate yearly schedule with multi-team support
  const getYearlyPassageSchedule = useYearlyPassageSchedule(
    filteredProjects,
    selectedYear,
    showWeekends,
    isProjectLockedOnDay,
    getProjectLockDetails
  );

  // Generate scheduled events with proper team assignment
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
              // Get teams assigned to this project
              const projectTeamAssignments = projectTeams.filter(pt => pt.projectId === project.id);
              let projectTeamIds: string[] = [];
              
              if (projectTeamAssignments.length > 0) {
                projectTeamIds = projectTeamAssignments.map(pt => pt.teamId);
              } else {
                // Fallback to legacy team field
                if (project.team) {
                  projectTeamIds = [project.team];
                }
              }
              
              events.push({
                id: `${project.id}-${date}`,
                projectId: project.id,
                projectName: project.name,
                teams: projectTeamIds,
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
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear, isProjectLockedOnDay, projectTeams]);

  // Group events by team with enhanced logic
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

    // Sort events within each project by date
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
    isLoading: false // TODO: Add proper loading state when integrating with backend
  };
};
