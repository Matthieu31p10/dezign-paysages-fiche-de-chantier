
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Clock } from 'lucide-react';

interface ProjectStat {
  id: string;
  name: string;
  address: string;
  eventsCount: number;
  totalHours: number;
  nextVisit?: {
    date: string;
  };
}

interface ModernSidebarProjectsProps {
  projectStats: ProjectStat[];
}

const ModernSidebarProjects: React.FC<ModernSidebarProjectsProps> = ({
  projectStats
}) => {
  return (
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
  );
};

export default ModernSidebarProjects;
