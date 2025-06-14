
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './calendar/hooks/useYearlyPassageSchedule';

interface ProjectScheduleListProps {
  selectedYear: number;
  selectedTeam: string;
}

interface ScheduledEvent {
  projectId: string;
  projectName: string;
  team: string;
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
}

const ProjectScheduleList: React.FC<ProjectScheduleListProps> = ({
  selectedYear,
  selectedTeam
}) => {
  const { projectInfos, teams } = useApp();

  const filteredProjects = useMemo(() => {
    return selectedTeam === 'all' 
      ? projectInfos.filter(p => !p.isArchived)
      : projectInfos.filter(p => p.team === selectedTeam && !p.isArchived);
  }, [projectInfos, selectedTeam]);

  const getYearlyPassageSchedule = useYearlyPassageSchedule(filteredProjects, selectedYear, true);

  const scheduledEvents = useMemo(() => {
    const events: ScheduledEvent[] = [];
    const yearlySchedule = getYearlyPassageSchedule(selectedYear);

    filteredProjects.forEach(project => {
      const projectSchedule = yearlySchedule[project.id];
      if (projectSchedule) {
        Object.entries(projectSchedule).forEach(([date, passageNumber]) => {
          events.push({
            projectId: project.id,
            projectName: project.name,
            team: project.team,
            date,
            passageNumber,
            totalPassages: project.annualVisits || 12,
            address: project.address,
            visitDuration: project.visitDuration
          });
        });
      }
    });

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear]);

  const groupedByProject = useMemo(() => {
    const grouped: Record<string, ScheduledEvent[]> = {};
    
    scheduledEvents.forEach(event => {
      if (!grouped[event.projectId]) {
        grouped[event.projectId] = [];
      }
      grouped[event.projectId].push(event);
    });

    return grouped;
  }, [scheduledEvents]);

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  if (Object.keys(groupedByProject).length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune date prévisionnelle
          </h3>
          <p className="text-gray-500">
            Aucune date prévisionnelle n'est programmée pour l'année sélectionnée.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByProject).map(([projectId, events]) => {
        const project = filteredProjects.find(p => p.id === projectId);
        if (!project) return null;

        return (
          <Card key={projectId} className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-white border-b border-blue-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600 font-normal flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {getTeamName(project.team)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 font-semibold">
                  {events.length} passage{events.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {events.map((event, index) => (
                  <div
                    key={`${event.projectId}-${event.date}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-semibold">
                          {format(new Date(event.date), "EEEE d MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        Passage {event.passageNumber}/{event.totalPassages}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{event.visitDuration}h</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.address}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectScheduleList;
