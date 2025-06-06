
import React, { useMemo } from 'react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, isSameMonth, getDay, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from '@/context/AppContext';

interface ScheduleCalendarProps {
  month: number;
  year: number;
  teamId: string;
}

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ month, year, teamId }) => {
  const { projectInfos } = useApp();
  
  const { monthStart, monthEnd, days, startDayOfWeek, teamProjects } = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let startDayOfWeek = getDay(monthStart);
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    
    const teamProjects = teamId === 'all'
      ? projectInfos
      : projectInfos.filter(project => project.team === teamId);
    
    return { monthStart, monthEnd, days, startDayOfWeek, teamProjects };
  }, [month, year, teamId, projectInfos]);
  
  const getYearlyPassageNumbers = useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlyPassages: Record<string, Record<string, number>> = {};
      
      teamProjects.forEach(project => {
        let passageCounter = 1;
        const visitsPerYear = project.annualVisits || 12;
        const interval = Math.floor(yearDays.filter(d => !isWeekend(d)).length / visitsPerYear);
        
        yearlyPassages[project.id] = {};
        
        for (let i = 0; i < visitsPerYear; i++) {
          const dayIndex = i * interval + Math.floor(interval / 2);
          if (dayIndex < yearDays.length) {
            const day = yearDays[dayIndex];
            
            if (isWeekend(day)) continue;
            
            const dateKey = format(day, 'yyyy-MM-dd');
            yearlyPassages[project.id][dateKey] = passageCounter;
            passageCounter++;
          }
        }
      });
      
      return yearlyPassages;
    };
  }, [teamProjects]);
  
  const getEventsForDay = (date: Date) => {
    if (isWeekend(date)) return [];
    
    const events = [];
    const dateString = format(date, 'yyyy-MM-dd');
    const yearlyPassages = getYearlyPassageNumbers(year);
    
    teamProjects.forEach(project => {
      const day = date.getDate();
      
      if ((day % Math.max(1, project.annualVisits % 30)) === 0) {
        const passageNumber = yearlyPassages[project.id]?.[dateString] || 1;
        
        events.push({
          id: `${project.id}-${dateString}`,
          projectId: project.id,
          projectName: project.name,
          team: project.team,
          duration: project.visitDuration,
          passageNumber: passageNumber
        });
      }
    });
    
    return events;
  };
  
  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white">
      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
          {daysOfWeek.map((day, index) => (
            <div 
              key={day} 
              className={`text-center font-semibold py-4 text-sm border-r border-gray-200 last:border-r-0 ${
                index >= 5 ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0">
          {Array.from({ length: startDayOfWeek - 1 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-28 border-r border-b border-gray-200 bg-gray-50/50"></div>
          ))}
          
          {days.map((day) => {
            const isWeekendDay = isWeekend(day);
            const dateEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={day.toString()} 
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
                    {dateEvents.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                        {dateEvents.length}
                      </Badge>
                    )}
                  </div>
                  
                  {isWeekendDay ? (
                    <div className="text-xs text-gray-400 italic text-center mt-2">
                      Non travaillé
                    </div>
                  ) : (
                    <div className="space-y-1 flex-1 overflow-y-auto">
                      {dateEvents.map((event) => (
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
                                <p className="text-green-600">Passage n°{event.passageNumber}</p>
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
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ScheduleCalendar);
