
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, startOfYear, endOfYear } from 'date-fns';
import { TeamEvent } from '../types';

interface Project {
  id: string;
  name: string;
  team: string;
  visitDuration: number;
  address: string;
  annualVisits?: number;
}

export const useTeamEvents = (projects: Project[], teamId: string, month: number, year: number) => {
  return useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const yearStart = startOfYear(new Date(year, 0));
    const yearEnd = endOfYear(new Date(year, 0));
    const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const events: Record<string, TeamEvent[]> = {};
    
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      events[dateKey] = [];
    });
    
    const teamProjects = teamId === 'all' 
      ? projects 
      : projects.filter(p => p.team === teamId);
    
    teamProjects.forEach(project => {
      const annualVisits = project.annualVisits || 12;
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
      
      days.forEach(day => {
        if (isWeekend(day)) return;
        
        const dateKey = format(day, 'yyyy-MM-dd');
        const passageNumber = yearlySchedule[dateKey];
        
        if (passageNumber) {
          events[dateKey].push({
            id: `${project.id}-${dateKey}`,
            projectId: project.id,
            projectName: project.name,
            team: project.team,
            duration: project.visitDuration,
            address: project.address,
            passageNumber: passageNumber,
            totalPassages: annualVisits
          });
        }
      });
    });
    
    return events;
  }, [projects, teamId, month, year]);
};
