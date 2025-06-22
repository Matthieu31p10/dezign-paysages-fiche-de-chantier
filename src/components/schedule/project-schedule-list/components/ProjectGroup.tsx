
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import EventItem from './EventItem';

interface ProjectGroupProps {
  project: ProjectInfo;
  events: any[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

const ProjectGroup: React.FC<ProjectGroupProps> = React.memo(({
  project,
  events,
  isExpanded,
  onToggleExpansion,
}) => {
  return (
    <Card className="border border-gray-200">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
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
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              {events.map((event) => (
                <EventItem
                  key={`${event.projectId}-${event.date}`}
                  event={event}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});

ProjectGroup.displayName = 'ProjectGroup';

export default ProjectGroup;
