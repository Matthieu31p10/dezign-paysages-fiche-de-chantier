
import React, { useMemo } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Team, ProjectInfo } from '@/types/models';
import { Users, Calendar, Clock } from 'lucide-react';

interface TeamSchedulesProps {
  month: number;
  year: number;
  teamId: string;
  teams: Team[];
  projects: ProjectInfo[];
}

const TeamSchedules: React.FC<TeamSchedulesProps> = React.memo(({ 
  month, 
  year, 
  teamId, 
  teams, 
  projects 
}) => {
  
  // Mémorisation des équipes à afficher
  const teamsToDisplay = useMemo(() => {
    return teamId === 'all' ? teams : teams.filter(t => t.id === teamId);
  }, [teamId, teams]);
  
  // Mémorisation des événements pour toutes les équipes
  const teamEvents = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const yearStart = startOfYear(new Date(year, 0));
    const yearEnd = endOfYear(new Date(year, 0));
    const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const eventsMap: Record<string, Record<string, any[]>> = {};
    
    teamsToDisplay.forEach(team => {
      const events: Record<string, any[]> = {};
      
      // Initialiser les tableaux vides pour chaque jour du mois
      days.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        events[dateKey] = [];
      });
      
      // Filtrer les projets par équipe
      const teamProjects = teamId === 'all' 
        ? projects 
        : projects.filter(p => p.team === team.id);
      
      // Pour chaque projet, calculer les numéros de passage sur l'année civile
      teamProjects.forEach(project => {
        const visitsPerYear = project.annualVisits || 12;
        const workingDaysInYear = yearDays.filter(d => !isWeekend(d));
        const interval = Math.floor(workingDaysInYear.length / visitsPerYear);
        
        // Créer une map des passages pour toute l'année
        const yearlyPassages: Record<string, number> = {};
        let passageCounter = 1;
        
        for (let i = 0; i < visitsPerYear; i++) {
          const dayIndex = i * interval + Math.floor(interval / 2);
          if (dayIndex < workingDaysInYear.length) {
            const day = workingDaysInYear[dayIndex];
            const dateKey = format(day, 'yyyy-MM-dd');
            yearlyPassages[dateKey] = passageCounter;
            passageCounter++;
          }
        }
        
        // Ajouter les événements du mois avec les bons numéros de passage
        const visitsPerMonth = Math.max(1, Math.round(visitsPerYear / 12));
        const monthInterval = Math.floor(days.length / visitsPerMonth);
        
        for (let i = 0; i < visitsPerMonth; i++) {
          const dayIndex = i * monthInterval + Math.floor(monthInterval / 2);
          if (dayIndex < days.length) {
            const day = days[dayIndex];
            
            if (!isWeekend(day)) {
              const dateKey = format(day, 'yyyy-MM-dd');
              const passageNumber = yearlyPassages[dateKey] || 1;
              
              events[dateKey].push({
                id: `${project.id}-${dateKey}`,
                projectId: project.id,
                projectName: project.name,
                team: project.team,
                duration: project.visitDuration,
                address: project.address,
                passageNumber: passageNumber
              });
            }
          }
        }
      });
      
      eventsMap[team.id] = events;
    });
    
    return eventsMap;
  }, [month, year, teamsToDisplay, projects, teamId]);
  
  const monthName = useMemo(() => {
    return new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  }, [month, year]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {teamsToDisplay.map(team => {
        const events = teamEvents[team.id] || {};
        const totalEvents = Object.values(events).reduce((sum, dayEvents) => sum + dayEvents.length, 0);
        
        return (
          <Card key={team.id} className="overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 via-green-25 to-white border-b border-green-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-green-800 font-semibold">{team.name}</span>
                    <p className="text-sm text-green-600 font-normal">Équipe de terrain</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 font-medium">
                    {totalEvents} passage{totalEvents > 1 ? 's' : ''} en {monthName.split(' ')[0]}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="space-y-3">
                {Object.entries(events)
                  .filter(([_, dayEvents]) => dayEvents.length > 0)
                  .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                  .map(([date, dayEvents]) => {
                    return (
                      <AccordionItem 
                        key={date} 
                        value={date} 
                        className="border border-green-100 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-sm"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-green-50/50 transition-colors duration-200">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-800 font-bold text-sm">
                                  {format(new Date(date), "d")}
                                </span>
                              </div>
                              <div className="text-left">
                                <span className="font-semibold text-gray-800">
                                  {format(new Date(date), "EEEE d MMMM", { locale: fr })}
                                </span>
                                <p className="text-sm text-gray-500">
                                  {dayEvents.length} intervention{dayEvents.length > 1 ? 's' : ''} prévue{dayEvents.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {dayEvents.reduce((sum, event) => sum + event.duration, 0)}h
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 bg-gray-50/30">
                          <div className="space-y-3">
                            {dayEvents.map((event, index) => (
                              <div 
                                key={event.id} 
                                className="p-4 border border-green-200 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-semibold text-green-800 text-lg">{event.projectName}</h4>
                                      <Badge variant="outline" className="text-xs bg-green-600 text-white border-green-700 animate-scale-in">
                                        Passage {event.passageNumber}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                      {event.address}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Durée estimée: {event.duration}h
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                
                {Object.entries(events).filter(([_, dayEvents]) => dayEvents.length > 0).length === 0 && (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">Aucun passage programmé</p>
                    <p className="text-sm mt-1">pour cette période</p>
                  </div>
                )}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
      
      {teamsToDisplay.length === 0 && (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="font-medium">Aucune équipe sélectionnée</p>
          <p className="text-sm mt-1">Veuillez sélectionner une équipe pour voir le planning</p>
        </div>
      )}
    </div>
  );
});

TeamSchedules.displayName = 'TeamSchedules';

export default TeamSchedules;
