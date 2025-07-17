
import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, isWeekend } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './useYearlyPassageSchedule';
import { useProjectLocks } from '../../project-locks/hooks/useProjectLocks';

export const useCalendarData = (month: number, year: number, teamId: string, showWeekends: boolean) => {
  const { projectInfos } = useApp();
  const { isProjectLockedOnDay, getProjectLockDetails } = useProjectLocks();

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

  // Pass lock checking functions and monthly rules to useYearlyPassageSchedule
  const getYearlyPassageSchedule = useYearlyPassageSchedule(
    teamProjects, 
    year, 
    showWeekends, 
    isProjectLockedOnDay,
    getProjectLockDetails,
    undefined // Monthly rules integration pending
  );
  
  const getEventsForDay = (date: Date) => {
    // Ne jamais afficher d'événements les weekends, même si showWeekends est true
    if (isWeekend(date)) return [];
    
    const events = [];
    const dateString = format(date, 'yyyy-MM-dd');
    const yearlySchedule = getYearlyPassageSchedule(year);
    const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
    
    // Check for events on this day
    
    teamProjects.forEach(project => {
      // Les verrouillages avec délai minimum 0 bloquent complètement le jour
      const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
      if (isLocked) {
        const lockDetails = getProjectLockDetails(project.id, dayOfWeek);
        const minDays = lockDetails?.minDaysBetweenVisits;
        
        // Si délai minimum 0 ou undefined, bloquer complètement
        if (!minDays || minDays === 0) {
          // Project locked on this day
          return;
        }
        // Sinon, les passages sont gérés par la logique de génération avec délais
      }

      const passageNumber = yearlySchedule[project.id]?.[dateString];
      
      if (passageNumber) {
        // Add scheduled passage for this project
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
    
    // Return events for this day
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
