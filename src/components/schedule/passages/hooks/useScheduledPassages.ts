
import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useModernScheduleData } from '../../modern/hooks/useModernScheduleData';
import { isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { safeParseDateString } from '@/utils/dateUtils';

export const useScheduledPassages = (selectedTeams: string[], showWeekends: boolean) => {
  const { teams } = useApp();
  const [timeFilter, setTimeFilter] = useState<'today' | 'tomorrow' | 'week' | 'month'>('week');
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const { scheduledEvents } = useModernScheduleData({
    selectedMonth: currentMonth,
    selectedYear: currentYear,
    selectedTeams,
    showWeekends
  });

  const filteredEvents = useMemo(() => {
    const now = new Date();
    
    let filteredByTime = scheduledEvents.filter(event => {
      const eventDate = safeParseDateString(event.date);
      
      if (!eventDate) {
        console.warn('Invalid event date:', event.date);
        return false;
      }
      
      switch (timeFilter) {
        case 'today':
          return isToday(eventDate);
        case 'tomorrow':
          return isTomorrow(eventDate);
        case 'week':
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
          return eventDate >= weekStart && eventDate <= weekEnd;
        case 'month':
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    return filteredByTime.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.projectName.localeCompare(b.projectName);
    });
  }, [scheduledEvents, timeFilter]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof filteredEvents> = {};
    
    filteredEvents.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  const getTeamInfo = (teamId: string) => {
    return teams.find(team => team.id === teamId);
  };

  return {
    timeFilter,
    setTimeFilter,
    groupedEvents,
    getTeamInfo
  };
};
