
import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Team, ProjectInfo } from '@/types/models';
import { Users, Clock, MapPin } from 'lucide-react';

interface TeamSchedulesProps {
  month: number;
  year: number;
  teamId: string;
  teams: Team[];
  projects: ProjectInfo[];
}

const TeamSchedules: React.FC<TeamSchedulesProps> = ({ 
  month, 
  year, 
  teamId, 
  teams, 
  projects 
}) => {
  const teamsToDisplay = useMemo(() => 
    teamId === 'all' ? teams : teams.filter(t => t.id === teamId)
  , [teamId, teams]);

  const getTeamEvents = useMemo(() => {
    return (projects: ProjectInfo[], teamId: string, month: number, year: number) => {
      const monthStart = startOfMonth(new Date(year, month - 1));
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      const yearStart = startOfYear(new Date(year, 0));
      const yearEnd = endOfYear(new Date(year, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const events: Record<string, any[]> = {};
      
      days.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        events[dateKey] = [];
      });
      
      const teamProjects = teamId === 'all' 
        ? projects 
        : projects.filter(p => p.team === teamId);
      
      teamProjects.forEach(project => {
        const visitsPerYear = project.annualVisits || 12;
        const workingDaysInYear = yearDays.filter(d => !isWeekend(d));
        const interval = Math.floor(workingDaysInYear.length / visitsPerYear);
        
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
        
        const visitsPerMonth = Math.max(1, Math.round(visitsPerYear / 12));
        const monthInterval = Math.floor(days.length / visitsPerMonth);
        
        for (let i = 0; i < visitsPerMonth; i++) {
          const dayIndex = i * monthInterval + Math.floor(monthInterval / 2);
          if (dayIndex < days.length) {
            const day = days[dayIndex];
            
            if (isWeekend(day)) continue;
            
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
      });
      
      return events;
    };
  }, []);
  
  return (
    <div className="space-y-6">
      {teamsToDisplay.map(team => {
        const events = getTeamEvents(projects, team.id, month, year);
        const monthName = new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
        
        const totalEvents = Object.values(events).reduce((sum, dayEvents) => sum + dayEvents.length, 0);
        
        return (
          <Card key={team.id} className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 via-green-25 to-white border-b border-green-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">Équipe de terrain</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 font-semibold">
                  {totalEvents} passage{totalEvents !== 1 ? 's' : ''} • {monthName}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.entries(events)
                .filter(([_, dayEvents]) => dayEvents.length > 0)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(events)
                    .filter(([_, dayEvents]) => dayEvents.length > 0)
                    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                    .map(([date, dayEvents]) => (
                      <AccordionItem key={date} value={date} className="border-b border-gray-100 last:border-b-0">
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <span className="font-semibold text-gray-900">
                                  {format(new Date(date), "EEEE d MMMM", { locale: fr })}
                                </span>
                                <p className="text-sm text-gray-500 capitalize">
                                  {format(new Date(date), "EEEE", { locale: fr })}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {dayEvents.length} chantier{dayEvents.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-4">
                            {dayEvents.map((event, index) => (
                              <div key={event.id} className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge variant="outline" className="bg-green-600 text-white border-green-600 font-bold text-xs">
                                        #{event.passageNumber}
                                      </Badge>
                                      <h4 className="font-bold text-green-800 text-lg">{event.projectName}</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <MapPin className="h-4 w-4" />
                                      <p className="text-sm">{event.address}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Clock className="h-4 w-4" />
                                      <span className="text-sm font-medium">{event.duration}h</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div className="p-8 text-center">
                  <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun passage programmé</h3>
                  <p className="text-gray-500">Aucun passage n'est programmé pour cette équipe ce mois-ci.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {teamsToDisplay.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune équipe sélectionnée</h3>
            <p className="text-gray-500">Veuillez sélectionner une équipe pour voir les passages programmés.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default React.memo(TeamSchedules);
