
import React from 'react';
import { format, isToday, isWeekend } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  projectId: string;
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
  description: string;
  type: 'maintenance' | 'holiday' | 'formation' | 'autre';
}

interface CalendarDayProps {
  day: Date;
  events: CalendarEvent[];
  showWeekends: boolean;
  lockedDays?: LockedDay[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, events, showWeekends, lockedDays = [] }) => {
  const isWeekendDay = isWeekend(day);
  const isCurrentDay = isToday(day);
  const dateString = format(day, 'yyyy-MM-dd');
  
  // Check if this day is locked
  const lockedDay = lockedDays.find(locked => locked.date === dateString);
  const isLocked = !!lockedDay;

  // Skip weekend days if showWeekends is false
  if (!showWeekends && isWeekendDay) {
    return null;
  }

  const getLockedDayColor = (type: LockedDay['type']) => {
    switch (type) {
      case 'maintenance': return 'from-orange-100 to-orange-50 border-orange-300';
      case 'holiday': return 'from-green-100 to-green-50 border-green-300';
      case 'formation': return 'from-blue-100 to-blue-50 border-blue-300';
      default: return 'from-gray-100 to-gray-50 border-gray-300';
    }
  };

  return (
    <div 
      className={`h-28 border-r border-b border-gray-200 last:border-r-0 relative transition-colors hover:bg-gray-50 ${
        isLocked ? `bg-gradient-to-br ${getLockedDayColor(lockedDay.type)} border-2` :
        isCurrentDay ? 'bg-blue-50 border-blue-200' : 
        isWeekendDay ? 'bg-gray-50/70' : 'bg-white'
      }`}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${
            isCurrentDay ? 'text-blue-600 font-bold' : 
            isWeekendDay ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {format(day, 'd')}
          </span>
          <div className="flex items-center gap-1">
            {isLocked && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1 rounded bg-white/80 border">
                      <Lock className="h-3 w-3 text-gray-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white shadow-lg border">
                    <div className="text-sm p-1">
                      <p className="font-semibold text-red-600">Jour verrouillé</p>
                      <p className="font-medium text-gray-900">{lockedDay.title}</p>
                      {lockedDay.description && (
                        <p className="text-gray-600 mt-1">{lockedDay.description}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {events.length > 0 && !isLocked && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                {events.length}
              </Badge>
            )}
          </div>
        </div>
        
        {isLocked ? (
          <div className="text-xs text-center mt-2 px-1">
            <p className="font-medium text-gray-700 truncate">{lockedDay.title}</p>
            <p className="text-red-600 font-medium">Passages suspendus</p>
          </div>
        ) : isWeekendDay && showWeekends ? (
          <div className="text-xs text-gray-400 italic text-center mt-2">
            Non travaillé
          </div>
        ) : (
          <div className="space-y-1 flex-1 overflow-y-auto">
            {events.map((event) => (
              <TooltipProvider key={event.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs px-2 py-1 rounded bg-gradient-to-r from-green-100 to-green-50 border-l-3 border-green-500 cursor-pointer hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="truncate flex-1 text-green-800 font-medium">
                          {event.projectName.length > 10 
                            ? `${event.projectName.slice(0, 10)}...` 
                            : event.projectName
                          }
                        </span>
                        <span className="ml-1 text-xs font-bold bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {event.passageNumber}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white shadow-lg border">
                    <div className="text-sm p-1">
                      <p className="font-semibold text-gray-900">{event.projectName}</p>
                      <p className="text-green-600">Passage n°{event.passageNumber}/{event.totalPassages}</p>
                      <p className="text-gray-600">Durée: {event.duration}h</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
