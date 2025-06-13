
import { useMemo } from 'react';
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend } from 'date-fns';
import { ProjectInfo } from '@/types/models';

export const useYearlyPassageSchedule = (
  teamProjects: ProjectInfo[], 
  year: number, 
  showWeekends: boolean
) => {
  return useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlySchedule: Record<string, Record<string, number>> = {};
      
      teamProjects.forEach(project => {
        const annualVisits = project.annualVisits || 12;
        const workingDays = showWeekends ? yearDays : yearDays.filter(d => !isWeekend(d));
        
        // Calculate interval between visits
        const interval = Math.floor(workingDays.length / annualVisits);
        
        yearlySchedule[project.id] = {};
        
        // Schedule visits evenly throughout the year
        for (let i = 0; i < annualVisits; i++) {
          let dayIndex = i * interval;
          
          // Add some variation to avoid all visits on the same day of week
          dayIndex += Math.floor(interval / 3);
          
          if (dayIndex < workingDays.length) {
            const scheduledDay = workingDays[dayIndex];
            
            // Skip weekends if showWeekends is false
            if (!showWeekends && isWeekend(scheduledDay)) {
              // Find next working day
              let nextDayIndex = dayIndex + 1;
              while (nextDayIndex < workingDays.length && isWeekend(workingDays[nextDayIndex])) {
                nextDayIndex++;
              }
              if (nextDayIndex < workingDays.length) {
                const dateKey = format(workingDays[nextDayIndex], 'yyyy-MM-dd');
                yearlySchedule[project.id][dateKey] = i + 1; // Passage number starts at 1
              }
            } else {
              const dateKey = format(scheduledDay, 'yyyy-MM-dd');
              yearlySchedule[project.id][dateKey] = i + 1; // Passage number starts at 1
            }
          }
        }
      });
      
      return yearlySchedule;
    };
  }, [teamProjects, showWeekends]);
};
