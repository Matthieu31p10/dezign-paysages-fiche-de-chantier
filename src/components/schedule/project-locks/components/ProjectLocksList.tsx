
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Lock } from 'lucide-react';
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
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Chantier inconnu';
  };

  if (locks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun verrouillage de jour configuré
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locks.map((lock) => (
        <Card key={lock.id} className={`${lock.isActive ? 'border-orange-200' : 'border-gray-200 opacity-60'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className={`h-4 w-4 ${lock.isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                <CardTitle className="text-sm font-medium">
                  {getProjectName(lock.projectId)}
                </CardTitle>
                <Badge variant={lock.isActive ? 'destructive' : 'secondary'}>
                  {getDayLabel(lock.dayOfWeek)}
                </Badge>
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
            <p className="text-sm font-medium text-gray-900">{lock.reason}</p>
            {lock.description && (
              <p className="text-xs text-gray-600 mt-1">{lock.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Créé le {lock.createdAt.toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectLocksList;
