import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, startOfYear, endOfYear } from 'date-fns';

export interface ScheduledEvent {
  id: string;
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

export interface TeamGroupData {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

/**
 * Generate calendar days for a given month and year
 */
export const generateCalendarDays = (month: number, year: number, showWeekends: boolean = true) => {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const filteredDays = showWeekends ? days : days.filter(day => !isWeekend(day));
  const startDayOfWeek = monthStart.getDay();
  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  return {
    days: filteredDays,
    startDayOfWeek,
    daysOfWeek: showWeekends ? daysOfWeek : daysOfWeek.filter((_, index) => index !== 0 && index !== 6)
  };
};

/**
 * Generate yearly schedule for a project
 */
export const generateYearlySchedule = (annualVisits: number, year: number) => {
  const yearStart = startOfYear(new Date(year, 0));
  const yearEnd = endOfYear(new Date(year, 0));
  const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
  const workingDaysInYear = yearDays.filter(d => !isWeekend(d));
  
  const interval = Math.floor(workingDaysInYear.length / annualVisits);
  const yearlySchedule: Record<string, number> = {};
  
  for (let i = 0; i < annualVisits; i++) {
    let dayIndex = i * interval;
    dayIndex += Math.floor(interval / 3);
    
    if (dayIndex < workingDaysInYear.length) {
      const scheduledDay = workingDaysInYear[dayIndex];
      const dateKey = format(scheduledDay, 'yyyy-MM-dd');
      yearlySchedule[dateKey] = i + 1;
    }
  }
  
  return yearlySchedule;
};

/**
 * Group scheduled events by team
 */
export const groupEventsByTeam = (
  scheduledEvents: ScheduledEvent[],
  teams: Array<{ id: string; name: string; color: string }>
): TeamGroupData[] => {
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

  // Sort events within each project by date and sort team groups by team name
  Object.values(teamGroups).forEach(teamGroup => {
    Object.keys(teamGroup.projects).forEach(projectId => {
      teamGroup.projects[projectId].sort((a, b) => a.date.localeCompare(b.date));
    });
  });

  return Object.values(teamGroups).sort((a, b) => a.teamName.localeCompare(b.teamName));
};

/**
 * Filter events by date and teams
 */
export const filterEventsByDateAndTeams = (
  events: ScheduledEvent[],
  targetDate: string,
  selectedTeams: string[],
  showWeekends: boolean = true
): ScheduledEvent[] => {
  if (!showWeekends && isWeekend(new Date(targetDate))) {
    return [];
  }
  
  return events.filter(event => {
    const matchesDate = event.date === targetDate;
    const matchesTeam = selectedTeams.includes('all') || selectedTeams.includes(event.team);
    return matchesDate && matchesTeam;
  });
};

/**
 * Check if a project is locked on a specific day
 */
export const isProjectLockedOnDay = (
  projectLocks: Array<{ projectId: string; dayOfWeek: number; isActive: boolean }>,
  projectId: string,
  dayOfWeek: number
): boolean => {
  const lock = projectLocks.find(
    l => l.projectId === projectId && 
         l.dayOfWeek === dayOfWeek && 
         l.isActive
  );
  return !!lock;
};

/**
 * Get project lock details for a specific day
 */
export const getProjectLockDetails = (
  projectLocks: Array<{ projectId: string; dayOfWeek: number; isActive: boolean; minDaysBetweenVisits?: number }>,
  projectId: string,
  dayOfWeek: number
): { minDaysBetweenVisits?: number } | null => {
  const lock = projectLocks.find(
    l => l.projectId === projectId && 
         l.dayOfWeek === dayOfWeek && 
         l.isActive
  );
  
  if (!lock) return null;
  
  return {
    minDaysBetweenVisits: lock.minDaysBetweenVisits
  };
};