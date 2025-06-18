
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Lock, Calendar } from 'lucide-react';
import { ProjectDayLock } from '../types';
import { ProjectInfo } from '@/types/models';
import { getDayLabel } from '../constants';

interface ProjectLocksListProps {
  locks: ProjectDayLock[];
  projects: ProjectInfo[];
  onToggle: (lockId: string) => void;
  onDelete: (lockId: string) => void;
}

const ProjectLocksList: React.FC<ProjectLocksListProps> = ({
  locks,
  projects,
  onToggle,
  onDelete,
}) => {
  const getProjectInfo = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? { 
      name: project.name, 
      annualVisits: project.annualVisits || 12 
    } : { 
      name: 'Chantier inconnu', 
      annualVisits: 12 
    };
  };

  if (locks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Lock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium">Aucun verrouillage configuré</p>
        <p className="text-sm">Créez des consignes pour bloquer des passages selon le jour de la semaine</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locks.map((lock) => {
        const projectInfo = getProjectInfo(lock.projectId);
        return (
          <Card key={lock.id} className={`${lock.isActive ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 opacity-60'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${lock.isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <Lock className={`h-4 w-4 ${lock.isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {projectInfo.name}
                      <Badge variant={lock.isActive ? 'destructive' : 'secondary'} className="text-xs">
                        {getDayLabel(lock.dayOfWeek)}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Impact sur {projectInfo.annualVisits} passages/an
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={lock.isActive}
                    onCheckedChange={() => onToggle(lock.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(lock.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{lock.reason}</p>
                {lock.description && (
                  <p className="text-xs text-gray-600">{lock.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Créé le {lock.createdAt.toLocaleDateString('fr-FR')}</span>
                  {lock.isActive && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                      Actif
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectLocksList;
