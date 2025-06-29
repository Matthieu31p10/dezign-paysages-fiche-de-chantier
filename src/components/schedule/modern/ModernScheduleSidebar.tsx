
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin } from 'lucide-react';

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

interface ModernScheduleSidebarProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeams: string[];
  filteredProjects: any[];
  scheduledEvents: ScheduledEvent[];
}

const ModernScheduleSidebar: React.FC<ModernScheduleSidebarProps> = ({
  selectedMonth,
  selectedYear,
  selectedTeams,
  filteredProjects,
  scheduledEvents
}) => {
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('fr-FR', { month: 'long' });
  
  const monthEvents = scheduledEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === selectedMonth - 1 && eventDate.getFullYear() === selectedYear;
  });

  const totalHours = monthEvents.reduce((sum, event) => sum + event.visitDuration, 0);
  const totalProjects = new Set(monthEvents.map(event => event.projectId)).size;

  return (
    <div className="w-80 space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Résumé {monthName} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{monthEvents.length}</div>
              <div className="text-sm text-blue-600">Passages</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalHours}h</div>
              <div className="text-sm text-green-600">Total</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-semibold text-gray-700">{totalProjects}</div>
            <div className="text-sm text-gray-600">Chantiers concernés</div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Chantiers actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredProjects.slice(0, 10).map(project => {
              const projectEvents = monthEvents.filter(e => e.projectId === project.id);
              return (
                <div key={project.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{project.name}</div>
                    <div className="text-xs text-gray-500 truncate">{project.address}</div>
                  </div>
                  {projectEvents.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {projectEvents.length}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full p-2 text-left text-sm rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            Gérer les contraintes
          </button>
          <button className="w-full p-2 text-left text-sm rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            Distribution mensuelle
          </button>
          <button className="w-full p-2 text-left text-sm rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            Exporter le planning
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernScheduleSidebar;
