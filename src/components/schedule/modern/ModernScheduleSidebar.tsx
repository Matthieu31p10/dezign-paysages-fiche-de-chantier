import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, MapPin, Clock, TrendingUp, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [showConstraintsDialog, setShowConstraintsDialog] = useState(false);
  const [showTeamsDialog, setShowTeamsDialog] = useState(false);
  
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('fr-FR', { month: 'long' });
  
  // Memoized calculations for better performance
  const monthStats = useMemo(() => {
    const monthEvents = scheduledEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth - 1 && eventDate.getFullYear() === selectedYear;
    });

    const totalHours = monthEvents.reduce((sum, event) => sum + event.visitDuration, 0);
    const totalProjects = new Set(monthEvents.map(event => event.projectId)).size;
    const avgHoursPerProject = totalProjects > 0 ? Math.round((totalHours / totalProjects) * 10) / 10 : 0;

    return {
      totalEvents: monthEvents.length,
      totalHours,
      totalProjects,
      avgHoursPerProject,
      monthEvents
    };
  }, [scheduledEvents, selectedMonth, selectedYear]);

  // Memoized project stats
  const projectStats = useMemo(() => {
    return filteredProjects.slice(0, 8).map(project => {
      const projectEvents = monthStats.monthEvents.filter(e => e.projectId === project.id);
      const projectHours = projectEvents.reduce((sum, e) => sum + e.visitDuration, 0);
      
      return {
        ...project,
        eventsCount: projectEvents.length,
        totalHours: projectHours,
        nextVisit: projectEvents.find(e => new Date(e.date) >= new Date())
      };
    });
  }, [filteredProjects, monthStats.monthEvents]);

  const handleConstraintsClick = () => {
    setShowConstraintsDialog(true);
  };

  const handleDistributionClick = () => {
    // Navigate to schedule page with monthly distribution tab
    navigate('/schedule?tab=monthly-distribution');
  };

  const handleTeamsClick = () => {
    setShowTeamsDialog(true);
  };

  return (
    <>
      <div className="w-80 space-y-4">
        {/* Summary Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="capitalize">{monthName} {selectedYear}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{monthStats.totalEvents}</div>
                <div className="text-xs text-blue-600 font-medium">Passages</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{monthStats.totalHours}h</div>
                <div className="text-xs text-green-600 font-medium">Total</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-lg font-semibold text-purple-700">{monthStats.totalProjects}</div>
                <div className="text-xs text-purple-600 font-medium">Chantiers</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="text-lg font-semibold text-orange-700">{monthStats.avgHoursPerProject}h</div>
                <div className="text-xs text-orange-600 font-medium">Moy/projet</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Chantiers actifs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              <div className="space-y-2 p-4">
                {projectStats.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{project.name}</div>
                      <div className="text-xs text-gray-500 truncate">{project.address}</div>
                      {project.nextVisit && (
                        <div className="text-xs text-blue-600 mt-1">
                          Prochaine visite: {new Date(project.nextVisit.date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {project.eventsCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {project.eventsCount}
                        </Badge>
                      )}
                      {project.totalHours > 0 && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.totalHours}h
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {projectStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun chantier actif</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-10 hover:bg-blue-50 hover:text-blue-700"
              onClick={handleConstraintsClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Gérer les contraintes
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-10 hover:bg-green-50 hover:text-green-700"
              onClick={handleDistributionClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Distribution mensuelle
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-10 hover:bg-purple-50 hover:text-purple-700"
              onClick={handleTeamsClick}
            >
              <Users className="h-4 w-4 mr-2" />
              Gestion des équipes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Constraints Dialog */}
      <Dialog open={showConstraintsDialog} onOpenChange={setShowConstraintsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gérer les contraintes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configurez les contraintes de planification pour vos projets.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowConstraintsDialog(false);
                  navigate('/schedule?tab=project-locks');
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Verrouillages de projets
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowConstraintsDialog(false);
                  navigate('/schedule?tab=configuration');
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Règles de planification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Teams Dialog */}
      <Dialog open={showTeamsDialog} onOpenChange={setShowTeamsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des équipes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Gérez vos équipes et leur affectation aux projets.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowTeamsDialog(false);
                  navigate('/settings?tab=teams');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres des équipes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowTeamsDialog(false);
                  navigate('/schedule?tab=team-schedules');
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planning par équipe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModernScheduleSidebar;
