
import { useMemo } from 'react';
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, getDay } from 'date-fns';
import { ProjectInfo } from '@/types/models';

export const useYearlyPassageSchedule = (
  teamProjects: ProjectInfo[], 
  year: number, 
  showWeekends: boolean,
  isProjectLockedOnDay?: (projectId: string, dayOfWeek: number) => boolean
) => {
  return useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlySchedule: Record<string, Record<string, number>> = {};
      
      console.log('Generating yearly schedule with lock checking...');
      
      teamProjects.forEach(project => {
        const annualVisits = project.annualVisits || 12;
        
        yearlySchedule[project.id] = {};
        
        // Filter out locked days if lock function is provided
        let availableDays = showWeekends ? yearDays : yearDays.filter(d => !isWeekend(d));
        
        if (isProjectLockedOnDay) {
          availableDays = availableDays.filter(day => {
            const dayOfWeek = getDay(day) === 0 ? 7 : getDay(day);
            const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
            if (isLocked) {
              console.log(`Filtering out ${format(day, 'yyyy-MM-dd')} for project ${project.name} - day ${dayOfWeek} is locked`);
            }
            return !isLocked;
          });
        }
        
        console.log(`Project ${project.name}: ${availableDays.length} available days for ${annualVisits} annual visits`);
        
        if (availableDays.length === 0) {
          console.warn(`No available days for project ${project.name} - all days are locked!`);
          return;
        }
        
        // Calculate interval based on available days
        const interval = Math.floor(availableDays.length / annualVisits);
        
        for (let i = 0; i < annualVisits && i < availableDays.length; i++) {
          let dayIndex = i * interval;
          dayIndex += Math.floor(interval / 3);
          
          if (dayIndex < availableDays.length) {
            const scheduledDay = availableDays[dayIndex];
            const dateKey = format(scheduledDay, 'yyyy-MM-dd');
            yearlySchedule[project.id][dateKey] = i + 1;
            console.log(`Scheduled visit ${i + 1} for ${project.name} on ${dateKey}`);
          }
        }
      });
      
      return yearlySchedule;
    };
  }, [teamProjects, showWeekends, isProjectLockedOnDay]);
};
