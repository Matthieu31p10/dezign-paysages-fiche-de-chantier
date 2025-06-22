
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Users, ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import TeamBadge from '@/components/ui/team-badge';
import ProjectGroup from './ProjectGroup';
import { ProjectInfo } from '@/types/models';

interface TeamGroupProps {
  teamId: string;
  teamName: string;
  teamColor: string;
  projects: Record<string, any[]>;
  filteredProjects: ProjectInfo[];
  expandedProjects: Record<string, boolean>;
  isExpanded: boolean;
  onToggleExpansion: (teamId: string) => void;
  onToggleProject: (projectId: string) => void;
  onToggleAllProjects: (teamId: string, expand: boolean) => void;
}

const TeamGroup: React.FC<TeamGroupProps> = React.memo(({
  teamId,
  teamName,
  teamColor,
  projects,
  filteredProjects,
  expandedProjects,
  isExpanded,
  onToggleExpansion,
  onToggleProject,
  onToggleAllProjects,
}) => {
  const totalPassages = Object.values(projects).reduce((sum, events) => sum + events.length, 0);

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={() => onToggleExpansion(teamId)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-white border-b border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-3">
                  <TeamBadge teamName={teamName} teamColor={teamColor} size="md" />
                  <span className="text-lg font-bold text-gray-900">
                    {Object.keys(projects).length} chantier{Object.keys(projects).length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 font-semibold">
                  {totalPassages} passage{totalPassages !== 1 ? 's' : ''}
                </Badge>
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
                onClick={() => onToggleAllProjects(teamId, true)}
                className="flex items-center gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Tout déplier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleAllProjects(teamId, false)}
                className="flex items-center gap-2"
              >
                <Minimize2 className="h-4 w-4" />
                Tout replier
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(projects).map(([projectId, events]) => {
                const project = filteredProjects.find(p => p.id === projectId);
                if (!project) return null;

                return (
                  <ProjectGroup
                    key={projectId}
                    project={project}
                    events={events}
                    isExpanded={expandedProjects[projectId] ?? true}
                    onToggleExpansion={() => onToggleProject(projectId)}
                  />
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});

TeamGroup.displayName = 'TeamGroup';

export default TeamGroup;
