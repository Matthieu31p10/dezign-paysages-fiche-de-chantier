
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

// Jours de la semaine en français
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = React.memo(({ month, year, teamId }) => {
  const { projectInfos, workLogs } = useApp();
  
  // Mémorisation des calculs coûteux
  const monthData = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let startDayOfWeek = getDay(monthStart);
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    
    return { monthStart, monthEnd, days, startDayOfWeek };
  }, [month, year]);
  
  // Filtrage des projets par équipe avec mémorisation
  const teamProjects = useMemo(() => {
    return teamId === 'all'
      ? projectInfos
      : projectInfos.filter(project => project.team === teamId);
  }, [projectInfos, teamId]);
  
  // Calcul des passages annuels avec mémorisation
  const yearlyPassageNumbers = useMemo(() => {
    const yearStart = startOfYear(new Date(year, 0));
    const yearEnd = endOfYear(new Date(year, 0));
    const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const yearlyPassages: Record<string, Record<string, number>> = {};
    
    teamProjects.forEach(project => {
      let passageCounter = 1;
      const visitsPerYear = project.annualVisits || 12;
      const workingDays = yearDays.filter(d => !isWeekend(d));
      const interval = Math.floor(workingDays.length / visitsPerYear);
      
      yearlyPassages[project.id] = {};
      
      for (let i = 0; i < visitsPerYear; i++) {
        const dayIndex = i * interval + Math.floor(interval / 2);
        if (dayIndex < workingDays.length) {
          const day = workingDays[dayIndex];
          if (!isWeekend(day)) {
            const dateKey = format(day, 'yyyy-MM-dd');
            yearlyPassages[project.id][dateKey] = passageCounter;
            passageCounter++;
          }
        }
      }
    });
    
    return yearlyPassages;
  }, [teamProjects, year]);
  
  // Fonction pour obtenir les événements d'une journée
  const getEventsForDay = useMemo(() => {
    return (date: Date) => {
      if (isWeekend(date)) return [];
      
      const events = [];
      const dateString = format(date, 'yyyy-MM-dd');
      const day = date.getDate();
      
      teamProjects.forEach(project => {
        if ((day % Math.max(1, project.annualVisits % 30)) === 0) {
          const passageNumber = yearlyPassageNumbers[project.id]?.[dateString] || 1;
          
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
  }, [teamProjects, yearlyPassageNumbers]);
  
  return (
    <Card className="overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => (
            <div 
              key={day} 
              className={`text-center font-medium py-3 text-sm transition-colors duration-200 ${
                index >= 5 
                  ? 'bg-gray-100 text-gray-600 border-b-2 border-gray-300' 
                  : 'bg-green-50 text-green-800 border-b-2 border-green-200'
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* Espaces vides avant le premier jour du mois */}
          {Array.from({ length: monthData.startDayOfWeek - 1 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-28 p-1 border bg-gray-50/50"></div>
          ))}
          
          {/* Jours du mois */}
          {monthData.days.map((day) => {
            const isWeekendDay = isWeekend(day);
            const dateEvents = getEventsForDay(day);
            const todayClass = isToday(day) ? 'bg-green-100 border-green-400 ring-2 ring-green-200' : '';
            const weekendClass = isWeekendDay ? 'bg-gray-100/80' : 'bg-white hover:bg-green-50/30';
            
            return (
              <div 
                key={day.toString()} 
                className={`h-28 p-2 border transition-all duration-200 overflow-hidden ${todayClass} ${weekendClass}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    isToday(day) ? 'text-green-800' : 
                    isWeekendDay ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dateEvents.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-green-500 text-white border-green-600 animate-fade-in">
                      {dateEvents.length}
                    </Badge>
                  )}
                </div>
                
                {isWeekendDay ? (
                  <div className="text-xs text-gray-500 italic text-center mt-3 font-medium">
                    Non travaillé
                  </div>
                ) : (
                  <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-thin scrollbar-thumb-green-200">
                    {dateEvents.map((event) => (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="text-xs truncate px-2 py-1 rounded-md cursor-pointer bg-green-100 border-l-3 border-green-500 relative transition-all duration-200 hover:bg-green-200 hover:scale-105 animate-fade-in"
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate flex-1 font-medium text-green-800">
                                  {event.projectName.length > 10 
                                    ? `${event.projectName.slice(0, 10)}...` 
                                    : event.projectName
                                  }
                                </span>
                                <span className="ml-1 text-xs font-bold bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none animate-scale-in">
                                  {event.passageNumber}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-green-200 shadow-lg">
                            <div className="text-sm p-1">
                              <p className="font-semibold text-green-800">{event.projectName}</p>
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

ScheduleCalendar.displayName = 'ScheduleCalendar';

export default ScheduleCalendar;
