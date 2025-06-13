
import { useMemo } from 'react';
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, addDays, addWeeks, addMonths, getDay, parseISO, isBefore, isAfter } from 'date-fns';
import { ProjectInfo } from '@/types/models';
import { useScheduling } from '@/context/SchedulingContext';
import { SchedulingRule } from '@/components/schedule/configuration/types';

const getDayOfWeekNumber = (dayName: string): number => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.indexOf(dayName.toLowerCase()) + 1;
};

const isPreferredDay = (date: Date, preferredDays: string[]): boolean => {
  if (!preferredDays || preferredDays.length === 0) return true;
  
  const dayOfWeek = getDay(date);
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday = 7
  
  return preferredDays.some(day => getDayOfWeekNumber(day) === adjustedDay);
};

const calculateNextScheduledDate = (
  lastDate: Date, 
  rule: SchedulingRule, 
  showWeekends: boolean
): Date => {
  let nextDate = lastDate;
  
  switch (rule.intervalType) {
    case 'days':
      nextDate = addDays(lastDate, rule.intervalValue);
      break;
    case 'weeks':
      nextDate = addWeeks(lastDate, rule.intervalValue);
      break;
    case 'months':
      nextDate = addMonths(lastDate, rule.intervalValue);
      break;
    default:
      nextDate = addWeeks(lastDate, 2); // Fallback to 2 weeks
  }
  
  // Adjust for weekends if needed
  if (rule.skipWeekends && !showWeekends && isWeekend(nextDate)) {
    const dayOfWeek = getDay(nextDate);
    if (dayOfWeek === 6) { // Saturday
      nextDate = addDays(nextDate, 2);
    } else if (dayOfWeek === 0) { // Sunday
      nextDate = addDays(nextDate, 1);
    }
  }
  
  // Check preferred days
  if (!isPreferredDay(nextDate, rule.preferredDays)) {
    // Find next preferred day within a week
    for (let i = 1; i <= 7; i++) {
      const candidateDate = addDays(nextDate, i);
      if (isPreferredDay(candidateDate, rule.preferredDays)) {
        if (!rule.skipWeekends || showWeekends || !isWeekend(candidateDate)) {
          nextDate = candidateDate;
          break;
        }
      }
    }
  }
  
  return nextDate;
};

export const useYearlyPassageSchedule = (
  teamProjects: ProjectInfo[], 
  year: number, 
  showWeekends: boolean
) => {
  const { getRuleForProject } = useScheduling();
  
  return useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlySchedule: Record<string, Record<string, number>> = {};
      
      teamProjects.forEach(project => {
        const rule = getRuleForProject(project.id);
        const annualVisits = project.annualVisits || 12;
        
        yearlySchedule[project.id] = {};
        
        if (rule) {
          // Use rule-based scheduling
          let currentDate = yearStart;
          
          // Apply start date from rule if specified
          if (rule.startDate) {
            const ruleStartDate = parseISO(rule.startDate);
            if (isAfter(ruleStartDate, yearStart) && isBefore(ruleStartDate, yearEnd)) {
              currentDate = ruleStartDate;
            }
          }
          
          let passageNumber = 1;
          const maxAttempts = annualVisits * 2; // Safety limit
          let attempts = 0;
          
          while (passageNumber <= annualVisits && attempts < maxAttempts) {
            attempts++;
            
            // Check if current date is within the year and valid period
            if (isBefore(currentDate, yearStart) || isAfter(currentDate, yearEnd)) {
              break;
            }
            
            // Check end date constraint
            if (rule.endDate) {
              const ruleEndDate = parseISO(rule.endDate);
              if (isAfter(currentDate, ruleEndDate)) {
                break;
              }
            }
            
            // Skip weekends if rule requires it
            if (rule.skipWeekends && !showWeekends && isWeekend(currentDate)) {
              currentDate = addDays(currentDate, 1);
              continue;
            }
            
            // Check if it's a preferred day
            if (isPreferredDay(currentDate, rule.preferredDays)) {
              const dateKey = format(currentDate, 'yyyy-MM-dd');
              yearlySchedule[project.id][dateKey] = passageNumber;
              passageNumber++;
            }
            
            // Calculate next date based on rule
            if (passageNumber <= annualVisits) {
              currentDate = calculateNextScheduledDate(currentDate, rule, showWeekends);
            }
          }
        } else {
          // Use default scheduling (existing logic)
          const workingDays = showWeekends ? yearDays : yearDays.filter(d => !isWeekend(d));
          const interval = Math.floor(workingDays.length / annualVisits);
          
          for (let i = 0; i < annualVisits; i++) {
            let dayIndex = i * interval;
            dayIndex += Math.floor(interval / 3);
            
            if (dayIndex < workingDays.length) {
              const scheduledDay = workingDays[dayIndex];
              
              if (!showWeekends && isWeekend(scheduledDay)) {
                let nextDayIndex = dayIndex + 1;
                while (nextDayIndex < workingDays.length && isWeekend(workingDays[nextDayIndex])) {
                  nextDayIndex++;
                }
                if (nextDayIndex < workingDays.length) {
                  const dateKey = format(workingDays[nextDayIndex], 'yyyy-MM-dd');
                  yearlySchedule[project.id][dateKey] = i + 1;
                }
              } else {
                const dateKey = format(scheduledDay, 'yyyy-MM-dd');
                yearlySchedule[project.id][dateKey] = i + 1;
              }
            }
          }
        }
      });
      
      return yearlySchedule;
    };
  }, [teamProjects, showWeekends, getRuleForProject]);
};
