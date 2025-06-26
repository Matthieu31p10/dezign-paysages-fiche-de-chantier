
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface CalendarEvent {
  id: string;
  projectName: string;
  team: string;
  duration: number;
  passageNumber: number;
  totalPassages: number;
}

interface LockedDay {
  id: string;
  date: string;
  title: string;
  type: 'maintenance' | 'holiday' | 'formation' | 'autre';
}

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  lockedDays: LockedDay[];
  isCurrentMonth?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  date, 
  events, 
  lockedDays, 
  isCurrentMonth = true 
}) => {
  const { isDropZoneActive, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop();
  const dayString = format(date, 'yyyy-MM-dd');
  const dayNumber = format(date, 'd');
  
  const dayLocks = lockedDays.filter(lock => lock.date === dayString);
  const isLocked = dayLocks.length > 0;
  
  const onDrop = (event: React.DragEvent) => {
    handleDrop(event, dayString);
  };

  return (
    <div 
      className={`
        min-h-[120px] p-2 border border-gray-200 bg-white relative
        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
        ${isLocked ? 'bg-red-50 border-red-200' : ''}
        ${isDropZoneActive ? 'bg-blue-100 border-blue-400 border-2 border-dashed' : ''}
        hover:bg-gray-50 transition-colors
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}>
          {dayNumber}
        </span>
        {isDropZoneActive && (
          <div className="text-xs text-blue-600 font-medium">
            Déposer ici
          </div>
        )}
      </div>
      
      {isLocked && (
        <div className="mb-2">
          {dayLocks.map(lock => (
            <Badge key={lock.id} variant="destructive" className="text-xs mb-1 block">
              {lock.title}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="text-xs p-1 rounded bg-blue-100 text-blue-800 border border-blue-200"
          >
            <div className="font-medium truncate">{event.projectName}</div>
            <div className="text-blue-600">
              {event.duration}h - Passage {event.passageNumber}/{event.totalPassages}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;
