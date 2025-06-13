
import React from 'react';
import CalendarDay from './CalendarDay';

interface CalendarEvent {
  id: string;
  projectId: string;
  projectName: string;
  team: string;
  duration: number;
  passageNumber: number;
  totalPassages: number;
}

interface CalendarGridProps {
  days: Date[];
  startDayOfWeek: number;
  showWeekends: boolean;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  days, 
  startDayOfWeek, 
  showWeekends, 
  getEventsForDay 
}) => {
  const getGridColumns = () => {
    return showWeekends ? 'grid-cols-7' : 'grid-cols-5';
  };

  const getEmptyStartCells = () => {
    if (!showWeekends) {
      // For weekdays only, adjust the start position
      const adjustedStart = startDayOfWeek > 5 ? 0 : startDayOfWeek - 1;
      return Array.from({ length: adjustedStart });
    }
    return Array.from({ length: startDayOfWeek - 1 });
  };

  return (
    <div className={`grid ${getGridColumns()} gap-0`}>
      {getEmptyStartCells().map((_, i) => (
        <div key={`empty-start-${i}`} className="h-28 border-r border-b border-gray-200 bg-gray-50/50"></div>
      ))}
      
      {days.map((day) => {
        const dateEvents = getEventsForDay(day);
        
        return (
          <CalendarDay
            key={day.toString()}
            day={day}
            events={dateEvents}
            showWeekends={showWeekends}
          />
        );
      })}
    </div>
  );
};

export default CalendarGrid;
