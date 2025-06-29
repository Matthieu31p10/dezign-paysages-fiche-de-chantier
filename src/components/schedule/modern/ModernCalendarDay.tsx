
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

interface ModernCalendarDayProps {
  date: Date;
  events: ScheduledEvent[];
}

const ModernCalendarDay: React.FC<ModernCalendarDayProps> = ({ date, events }) => {
  const dayNumber = format(date, 'd');
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="border-r border-b bg-white hover:bg-gray-50 transition-colors min-h-[120px] p-2 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' : 'text-gray-900'}`}>
          {dayNumber}
        </span>
        {events.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{events.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1 flex-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="text-xs p-1.5 rounded bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer"
          >
            <div className="font-medium truncate">{event.projectName}</div>
            <div className="text-blue-600 flex justify-between">
              <span>{event.visitDuration}h</span>
              <span>{event.passageNumber}/{event.totalPassages}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernCalendarDay;
