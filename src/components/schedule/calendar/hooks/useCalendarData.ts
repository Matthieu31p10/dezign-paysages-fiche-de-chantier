
import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, isWeekend } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './useYearlyPassageSchedule';
import { useProjectLocks } from '../../project-locks/hooks/useProjectLocks';

export const useCalendarData = (month: number, year: number, teamId: string, showWeekends: boolean) => {
  const { projectInfos } = useApp();
  const { isProjectLockedOnDay } = useProjectLocks();

  const daysOfWeek = useMemo(() => {
    if (showWeekends) {
      return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }
    return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  }, [showWeekends]);

  const { monthStart, monthEnd, days, startDayOfWeek, teamProjects } = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Filter weekends if showWeekends is false
    const days = showWeekends ? allDays : allDays.filter(day => !isWeekend(day));
    
    let startDayOfWeek = getDay(monthStart);
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    
    // Adjust start day for weekdays only view
    if (!showWeekends && startDayOfWeek > 5) {
      startDayOfWeek = 1; // Start from Monday if weekend
    } else if (!showWeekends && startDayOfWeek > 1) {
      startDayOfWeek = startDayOfWeek > 5 ? 1 : startDayOfWeek;
    }
    
    const teamProjects = teamId === 'all'
      ? projectInfos.filter(p => !p.isArchived)
      : projectInfos.filter(project => project.team === teamId && !project.isArchived);
    
    return { monthStart, monthEnd, days, startDayOfWeek, teamProjects };
  }, [month, year, teamId, projectInfos, showWeekends]);

  // Pass the lock checking function to useYearlyPassageSchedule
  const getYearlyPassageSchedule = useYearlyPassageSchedule(teamProjects, year, showWeekends, isProjectLockedOnDay);
  
  const getEventsForDay = (date: Date) => {
    if (!showWeekends && isWeekend(date)) return [];
    
    const events = [];
    const dateString = format(date, 'yyyy-MM-dd');
    const yearlySchedule = getYearlyPassageSchedule(year);
    const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date); // Convert Sunday from 0 to 7
    
    console.log(`Checking events for ${dateString}, day of week: ${dayOfWeek}`);
    
    teamProjects.forEach(project => {
      // Check if this project is locked on this day of the week
      const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
      console.log(`Project ${project.name} locked on day ${dayOfWeek}:`, isLocked);
      
      if (isLocked) {
        console.log(`Skipping project ${project.name} for ${dateString} due to lock`);
        return; // Skip this project for this day
      }

      const passageNumber = yearlySchedule[project.id]?.[dateString];
      
      if (passageNumber) {
        console.log(`Adding event for project ${project.name} on ${dateString}, passage ${passageNumber}`);
        events.push({
          id: `${project.id}-${dateString}`,
          projectId: project.id,
          projectName: project.name,
          team: project.team,
          duration: project.visitDuration,
          passageNumber: passageNumber,
          totalPassages: project.annualVisits || 12
        });
      }
    });
    
    console.log(`Total events for ${dateString}:`, events.length);
    return events;
  };

  return {
    daysOfWeek,
    days,
    startDayOfWeek,
    getEventsForDay,
    showWeekends
  };
};
