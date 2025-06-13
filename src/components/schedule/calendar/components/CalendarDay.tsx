
import React from 'react';
import { format, isToday, isWeekend } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarEvent {
  id: string;
  projectId: string;
  projectName: string;
  team: string;
  duration: number;
  passageNumber: number;
  totalPassages: number;
}

interface CalendarDayProps {
  day: Date;
  events: CalendarEvent[];
  showWeekends: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, events, showWeekends }) => {
  const isWeekendDay = isWeekend(day);
  const isCurrentDay = isToday(day);

  // Skip weekend days if showWeekends is false
  if (!showWeekends && isWeekendDay) {
    return null;
  }

  return (
    <div 
      className={`h-28 border-r border-b border-gray-200 last:border-r-0 relative transition-colors hover:bg-gray-50 ${
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
          {events.length > 0 && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
              {events.length}
            </Badge>
          )}
        </div>
        
        {isWeekendDay && showWeekends ? (
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
