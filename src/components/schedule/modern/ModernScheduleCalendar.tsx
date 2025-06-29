
import React, { useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWeekend } from 'date-fns';
import ModernCalendarGrid from './ModernCalendarGrid';

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
}

interface ModernScheduleCalendarProps {
  month: number;
  year: number;
  selectedTeams: string[];
  showWeekends: boolean;
  scheduledEvents: ScheduledEvent[];
  isLoading: boolean;
}

const ModernScheduleCalendar: React.FC<ModernScheduleCalendarProps> = ({
  month,
  year,
  selectedTeams,
  showWeekends,
  scheduledEvents,
  isLoading
}) => {
  // Memoized calendar calculations
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const filteredDays = showWeekends ? days : days.filter(day => !isWeekend(day));
    
    let startDayOfWeek = getDay(monthStart);
    // Convert Sunday (0) to Monday-based week (7)
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    
    // Adjust start day for weekdays-only view
    if (!showWeekends) {
      // If month starts on weekend, adjust to Monday
      if (startDayOfWeek > 5) {
        startDayOfWeek = 1;
      }
    }

    const daysOfWeek = showWeekends 
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

    return {
      filteredDays,
      startDayOfWeek: startDayOfWeek - 1, // Convert to 0-based for grid calculation
      daysOfWeek
    };
  }, [month, year, showWeekends]);

  // Memoized event filtering function
  const getEventsForDay = useMemo(() => {
    const eventsByDate = scheduledEvents.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, ScheduledEvent[]>);

    return (date: Date) => {
      if (!showWeekends && isWeekend(date)) return [];
      
      const dateString = format(date, 'yyyy-MM-dd');
      const dayEvents = eventsByDate[dateString] || [];
      
      return dayEvents.filter(event => {
        const matchesTeam = selectedTeams.includes('all') || 
          event.teams.some(teamId => selectedTeams.includes(teamId));
        return matchesTeam;
      });
    };
  }, [scheduledEvents, selectedTeams, showWeekends]);

  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className={`grid ${showWeekends ? 'grid-cols-7' : 'grid-cols-5'} gap-px mb-4`}>
            {calendarData.daysOfWeek.map((day, i) => (
              <div key={`${day}-${i}`} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className={`grid ${showWeekends ? 'grid-cols-7' : 'grid-cols-5'} gap-px`}>
            {Array.from({ length: showWeekends ? 35 : 25 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0 h-full">
      <ModernCalendarGrid
        days={calendarData.filteredDays}
        daysOfWeek={calendarData.daysOfWeek}
        startDayOfWeek={calendarData.startDayOfWeek}
        showWeekends={showWeekends}
        getEventsForDay={getEventsForDay}
      />
    </CardContent>
  );
};

export default ModernScheduleCalendar;
