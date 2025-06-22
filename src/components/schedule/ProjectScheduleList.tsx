import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, MapPin, Clock, Users, ChevronDown, ChevronUp, Minimize2, Maximize2, Lock } from 'lucide-react';
import { format, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '@/context/AppContext';
import { useYearlyPassageSchedule } from './calendar/hooks/useYearlyPassageSchedule';
import { useProjectLocks } from './project-locks/hooks/useProjectLocks';
import TeamBadge from '@/components/ui/team-badge';

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
  isLocked?: boolean;
}

interface TeamGroup {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

const ProjectScheduleList: React.FC<ProjectScheduleListProps> = ({
  selectedYear,
  selectedTeam
}) => {
  const { projectInfos, teams } = useApp();
  const { isProjectLockedOnDay } = useProjectLocks();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    return selectedTeam === 'all' 
      ? projectInfos.filter(p => !p.isArchived)
      : projectInfos.filter(p => p.team === selectedTeam && !p.isArchived);
  }, [projectInfos, selectedTeam]);

  const getYearlyPassageSchedule = useYearlyPassageSchedule(filteredProjects, selectedYear, true);

  const scheduledEvents = useMemo(() => {
    const events: ScheduledEvent[] = [];
    const yearlySchedule = getYearlyPassageSchedule(selectedYear);

    console.log('Generating scheduled events with lock checking...');

    filteredProjects.forEach(project => {
      const projectSchedule = yearlySchedule[project.id];
      if (projectSchedule) {
        Object.entries(projectSchedule).forEach(([date, passageNumber]) => {
          const dayOfWeek = getDay(new Date(date)) === 0 ? 7 : getDay(new Date(date));
          const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
          
          if (!isLocked) {
            events.push({
              projectId: project.id,
              projectName: project.name,
              team: project.team,
              date,
              passageNumber,
              totalPassages: project.annualVisits || 12,
              address: project.address,
              visitDuration: project.visitDuration,
              isLocked: false
            });
          } else {
            console.log(`Skipping locked event for ${project.name} on ${date} (day ${dayOfWeek})`);
          }
        });
      }
    });

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear, isProjectLockedOnDay]);

  const groupedByTeam = useMemo(() => {
    const teamGroups: Record<string, TeamGroup> = {};
    
    scheduledEvents.forEach(event => {
      const team = teams.find(t => t.id === event.team);
      const teamName = team ? team.name : 'Équipe inconnue';
      const teamColor = team ? team.color : '#6B7280';
      
      if (!teamGroups[event.team]) {
        teamGroups[event.team] = {
          teamId: event.team,
          teamName,
          teamColor,
          projects: {}
        };
      }
      
      if (!teamGroups[event.team].projects[event.projectId]) {
        teamGroups[event.team].projects[event.projectId] = [];
      }
      
      teamGroups[event.team].projects[event.projectId].push(event);
    });

    // Trier les projets dans chaque équipe par nom
    Object.values(teamGroups).forEach(teamGroup => {
      Object.keys(teamGroup.projects).forEach(projectId => {
        teamGroup.projects[projectId].sort((a, b) => a.date.localeCompare(b.date));
      });
    });

    return Object.values(teamGroups).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [scheduledEvents, teams]);

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleAllProjects = (teamId: string, expand: boolean) => {
    const teamGroup = groupedByTeam.find(g => g.teamId === teamId);
    if (teamGroup) {
      const updates: Record<string, boolean> = {};
      Object.keys(teamGroup.projects).forEach(projectId => {
        updates[projectId] = expand;
      });
      setExpandedProjects(prev => ({ ...prev, ...updates }));
    }
  };

  if (groupedByTeam.length === 0) {
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
      {groupedByTeam.map((teamGroup) => {
        const totalPassages = Object.values(teamGroup.projects).reduce((sum, events) => sum + events.length, 0);
        const isTeamExpanded = expandedTeams[teamGroup.teamId] ?? true;

        return (
          <Card key={teamGroup.teamId} className="shadow-lg border-0 overflow-hidden">
            <Collapsible open={isTeamExpanded} onOpenChange={() => toggleTeamExpansion(teamGroup.teamId)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-white border-b border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-3">
                        <TeamBadge teamName={teamGroup.teamName} teamColor={teamGroup.teamColor} size="md" />
                        <span className="text-lg font-bold text-gray-900">
                          {Object.keys(teamGroup.projects).length} chantier{Object.keys(teamGroup.projects).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 font-semibold">
                        {totalPassages} passage{totalPassages !== 1 ? 's' : ''}
                      </Badge>
                      {isTeamExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="p-6">
                  <div className="flex justify-end gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllProjects(teamGroup.teamId, true)}
                      className="flex items-center gap-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Tout déplier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllProjects(teamGroup.teamId, false)}
                      className="flex items-center gap-2"
                    >
                      <Minimize2 className="h-4 w-4" />
                      Tout replier
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(teamGroup.projects).map(([projectId, events]) => {
                      const project = filteredProjects.find(p => p.id === projectId);
                      if (!project) return null;

                      const isProjectExpanded = expandedProjects[projectId] ?? true;

                      return (
                        <Card key={projectId} className="border border-gray-200">
                          <Collapsible open={isProjectExpanded} onOpenChange={() => toggleProjectExpansion(projectId)}>
                            <CollapsibleTrigger asChild>
                              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                      <MapPin className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                                      <p className="text-sm text-gray-600 font-normal flex items-center gap-2 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {project.address}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 font-semibold">
                                      {events.length} passage{events.length !== 1 ? 's' : ''}
                                    </Badge>
                                    {isProjectExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <CardContent className="pt-0">
                                <div className="grid gap-3">
                                  {events.map((event) => (
                                    <div
                                      key={`${event.projectId}-${event.date}`}
                                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                        event.isLocked 
                                          ? 'bg-red-50 border-red-200' 
                                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                      }`}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-2 ${event.isLocked ? 'text-red-600' : 'text-green-600'}`}>
                                          {event.isLocked && <Lock className="h-4 w-4" />}
                                          <Calendar className="h-4 w-4" />
                                          <span className="font-semibold">
                                            {format(new Date(event.date), "EEEE d MMMM yyyy", { locale: fr })}
                                          </span>
                                        </div>
                                        <Badge variant="secondary" className={event.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}>
                                          {event.isLocked ? 'Verrouillé' : `Passage ${event.passageNumber}/${event.totalPassages}`}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">{event.visitDuration}h</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectScheduleList;
