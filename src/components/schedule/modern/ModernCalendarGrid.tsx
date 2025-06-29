
import React from 'react';
import { format } from 'date-fns';
import ModernCalendarDay from './ModernCalendarDay';

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

interface ModernCalendarGridProps {
  days: Date[];
  daysOfWeek: string[];
  startDayOfWeek: number;
  showWeekends: boolean;
  getEventsForDay: (date: Date) => ScheduledEvent[];
}

const ModernCalendarGrid: React.FC<ModernCalendarGridProps> = ({
  days,
  daysOfWeek,
  startDayOfWeek,
  showWeekends,
  getEventsForDay
}) => {
  const gridColumns = showWeekends ? 'grid-cols-7' : 'grid-cols-5';
  const emptyStartCells = Math.max(0, startDayOfWeek);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`grid ${gridColumns} border-b`}>
        {daysOfWeek.map((day) => (
          <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={`grid ${gridColumns} flex-1 border-l`}>
        {/* Empty cells for month start */}
        {Array.from({ length: emptyStartCells }).map((_, i) => (
          <div key={`empty-${i}`} className="border-r border-b bg-gray-50/50"></div>
        ))}
        
        {/* Days */}
        {days.map((day) => (
          <ModernCalendarDay
            key={format(day, 'yyyy-MM-dd')}
            date={day}
            events={getEventsForDay(day)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernCalendarGrid;
