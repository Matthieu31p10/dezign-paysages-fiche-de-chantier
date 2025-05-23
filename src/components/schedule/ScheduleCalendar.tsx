
import React from 'react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, isSameMonth, getDay } from 'date-fns';
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

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ month, year, teamId }) => {
  const { projectInfos, workLogs } = useApp();
  
  // Créer une date pour le premier jour du mois
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  
  // Obtenir tous les jours du mois
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Ajuster pour commencer le lundi (1) au lieu du dimanche (0)
  let startDayOfWeek = getDay(monthStart);
  if (startDayOfWeek === 0) startDayOfWeek = 7; // Dimanche = 7 au lieu de 0
  
  // Obtenir les chantiers associés à l'équipe sélectionnée
  const teamProjects = teamId === 'all'
    ? projectInfos
    : projectInfos.filter(project => project.team === teamId);
  
  // Fonction pour générer des événements simulés pour la démonstration
  // Dans une version réelle, ceux-ci viendraient des workLogs ou d'une table dédiée
  const getEventsForDay = (date: Date) => {
    // Ne pas retourner d'événements pour les weekends (samedi et dimanche)
    if (isWeekend(date)) {
      return [];
    }
    
    const events = [];
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Pour la démo, créer des événements pseudo-aléatoires basés sur le jour et l'id du chantier
    teamProjects.forEach(project => {
      const day = date.getDate();
      
      // Générer quelques événements basés sur une logique simple
      if ((day % Math.max(1, project.annualVisits % 30)) === 0) {
        events.push({
          id: `${project.id}-${dateString}`,
          projectId: project.id,
          projectName: project.name,
          team: project.team,
          duration: project.visitDuration
        });
      }
    });
    
    return events;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => (
            <div 
              key={day} 
              className={`text-center font-medium py-2 ${
                index >= 5 ? 'bg-gray-200 text-gray-500' : 'bg-muted text-muted-foreground'
              } text-sm`}
            >
              {day}
            </div>
          ))}
          
          {/* Espaces vides avant le premier jour du mois */}
          {Array.from({ length: startDayOfWeek - 1 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-24 p-1 border bg-muted/20"></div>
          ))}
          
          {/* Jours du mois */}
          {days.map((day) => {
            const isWeekendDay = isWeekend(day);
            const dateEvents = getEventsForDay(day);
            return (
              <div 
                key={day.toString()} 
                className={`h-24 p-1 border overflow-hidden ${
                  isToday(day) ? 'bg-primary/10 border-primary' : 
                  isWeekendDay ? 'bg-gray-200/70' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(day) ? 'text-primary' : 
                    isWeekendDay ? 'text-gray-500' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dateEvents.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {dateEvents.length}
                    </Badge>
                  )}
                </div>
                
                {isWeekendDay ? (
                  <div className="text-xs text-gray-500 italic text-center mt-2">
                    Non travaillé
                  </div>
                ) : (
                  <div className="space-y-1 overflow-y-auto max-h-[65px]">
                    {dateEvents.map((event) => (
                      <TooltipProvider key={event.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`text-xs truncate px-1.5 py-0.5 rounded-sm cursor-pointer bg-green-100 border-l-2 border-green-500`}
                            >
                              {event.projectName.length > 15 
                                ? `${event.projectName.slice(0, 15)}...` 
                                : event.projectName
                              }
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">{event.projectName}</p>
                              <p>Durée: {event.duration}h</p>
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
};

export default ScheduleCalendar;
