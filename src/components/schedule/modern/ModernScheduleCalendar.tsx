
import React from 'react';
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
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const filteredDays = showWeekends ? days : days.filter(day => !isWeekend(day));
  
  let startDayOfWeek = getDay(monthStart);
  if (startDayOfWeek === 0) startDayOfWeek = 7;
  
  if (!showWeekends && startDayOfWeek > 5) {
    startDayOfWeek = 1;
  } else if (!showWeekends && startDayOfWeek > 1) {
    startDayOfWeek = startDayOfWeek > 5 ? 1 : startDayOfWeek;
  }

  const getEventsForDay = (date: Date) => {
    if (!showWeekends && isWeekend(date)) return [];
    
    const dateString = format(date, 'yyyy-MM-dd');
    return scheduledEvents.filter(event => {
      const matchesDate = event.date === dateString;
      const matchesTeam = selectedTeams.includes('all') || 
        event.teams.some(teamId => selectedTeams.includes(teamId));
      return matchesDate && matchesTeam;
    });
  };

  const daysOfWeek = showWeekends 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-7 gap-px mb-4">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <ModernCalendarGrid
        days={filteredDays}
        daysOfWeek={daysOfWeek}
        startDayOfWeek={startDayOfWeek}
        showWeekends={showWeekends}
        getEventsForDay={getEventsForDay}
      />
    </CardContent>
  );
};

export default ModernScheduleCalendar;
