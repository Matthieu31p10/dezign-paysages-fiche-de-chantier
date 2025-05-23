
import React from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Team, ProjectInfo } from '@/types/models';
import { Users } from 'lucide-react';

interface TeamSchedulesProps {
  month: number;
  year: number;
  teamId: string;
  teams: Team[];
  projects: ProjectInfo[];
}

// Générer des événements pour la démonstration
const getTeamEvents = (projects: ProjectInfo[], teamId: string, month: number, year: number) => {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const events: Record<string, any[]> = {};
  
  // Initialiser les tableaux vides pour chaque jour
  days.forEach(day => {
    const dateKey = format(day, 'yyyy-MM-dd');
    events[dateKey] = [];
  });
  
  // Filtrer les projets par équipe
  const teamProjects = teamId === 'all' 
    ? projects 
    : projects.filter(p => p.team === teamId);
  
  // Pour chaque projet, générer des événements pseudo-aléatoires
  teamProjects.forEach(project => {
    // Simple logique de démonstration: visites basées sur le nombre de visites annuelles
    // et la durée de chaque visite
    const visitsPerMonth = Math.max(1, Math.round(project.annualVisits / 12));
    
    // Distribuer les visites à travers le mois
    const interval = Math.floor(days.length / visitsPerMonth);
    
    for (let i = 0; i < visitsPerMonth; i++) {
      const dayIndex = i * interval + Math.floor(interval / 2);
      if (dayIndex < days.length) {
        const day = days[dayIndex];
        
        // Éviter de programmer des événements pendant les weekends
        if (isWeekend(day)) {
          continue;
        }
        
        const dateKey = format(day, 'yyyy-MM-dd');
        
        events[dateKey].push({
          id: `${project.id}-${dateKey}`,
          projectId: project.id,
          projectName: project.name,
          team: project.team,
          duration: project.visitDuration,
          address: project.address,
        });
      }
    }
  });
  
  return events;
};

const TeamSchedules: React.FC<TeamSchedulesProps> = ({ 
  month, 
  year, 
  teamId, 
  teams, 
  projects 
}) => {
  const teamsToDisplay = teamId === 'all' ? teams : teams.filter(t => t.id === teamId);
  
  return (
    <div className="space-y-6">
      {teamsToDisplay.map(team => {
        const events = getTeamEvents(projects, team.id, month, year);
        const monthName = new Date(year, month - 1).toLocaleString('fr-FR', { month: 'long' });
        
        // Compter le nombre total d'événements pour cette équipe
        const totalEvents = Object.values(events).reduce((sum, dayEvents) => sum + dayEvents.length, 0);
        
        return (
          <Card key={team.id}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-600" />
                  <span>{team.name}</span>
                </div>
                <Badge variant="outline" className="bg-green-50">
                  {totalEvents} passages en {monthName}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="space-y-2">
                {Object.entries(events)
                  .filter(([_, dayEvents]) => dayEvents.length > 0)
                  .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                  .map(([date, dayEvents]) => {
                    const currentDate = new Date(date);
                    return (
                      <AccordionItem key={date} value={date} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">
                              {format(new Date(date), "EEEE d MMMM", { locale: fr })}
                            </span>
                            <Badge variant="outline" className="ml-2 bg-green-50">
                              {dayEvents.length} chantier{dayEvents.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2">
                          <div className="space-y-3">
                            {dayEvents.map(event => (
                              <div key={event.id} className="p-3 border rounded-lg bg-green-50/30">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-green-800">{event.projectName}</h4>
                                  <span className="text-sm text-gray-500">{event.duration}h</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.address}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                
                {Object.entries(events).filter(([_, dayEvents]) => dayEvents.length > 0).length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    Aucun passage programmé pour cette période
                  </div>
                )}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
      
      {teamsToDisplay.length === 0 && (
        <div className="p-6 text-center text-gray-500 border rounded-lg">
          Aucune équipe sélectionnée
        </div>
      )}
    </div>
  );
};

export default TeamSchedules;
