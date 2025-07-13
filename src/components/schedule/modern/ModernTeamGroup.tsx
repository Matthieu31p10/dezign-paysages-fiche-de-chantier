
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

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

interface TeamGroup {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, ScheduledEvent[]>;
}

interface ModernTeamGroupProps {
  teamGroup: TeamGroup;
}

const ModernTeamGroup: React.FC<ModernTeamGroupProps> = ({ teamGroup }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const totalEvents = Object.values(teamGroup.projects).flat().length;
  const totalHours = Object.values(teamGroup.projects).flat().reduce((sum, event) => sum + event.visitDuration, 0);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: teamGroup.teamColor }}
            />
            <h3 className="text-lg font-semibold">{teamGroup.teamName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{totalEvents} passages</Badge>
            <Badge variant="outline">{totalHours}h total</Badge>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {Object.entries(teamGroup.projects).map(([projectId, events]) => {
              const isProjectExpanded = expandedProjects[projectId];
              const firstEvent = events[0];
              
              return (
                <div key={projectId} className="border rounded-lg">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleProject(projectId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isProjectExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <div>
                          <div className="font-medium">{firstEvent.projectName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {firstEvent.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{events.length} passages</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {events.reduce((sum, e) => sum + e.visitDuration, 0)}h
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {isProjectExpanded && (
                    <div className="border-t bg-gray-50/50">
                      <div className="p-4 space-y-2">
                        {events.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-2 bg-card rounded border">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-medium">
                                {format(new Date(event.date), 'dd/MM/yyyy')}
                              </div>
                              <Badge variant="outline">
                                Passage {event.passageNumber}/{event.totalPassages}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {event.visitDuration}h
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ModernTeamGroup;
