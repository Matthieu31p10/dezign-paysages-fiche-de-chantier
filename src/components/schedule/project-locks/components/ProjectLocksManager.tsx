
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Plus } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { useProjectLocks } from '../hooks/useProjectLocks';
import ProjectLockForm from './ProjectLockForm';
import ProjectLocksList from './ProjectLocksList';

interface ProjectLocksManagerProps {
  projects: ProjectInfo[];
}

const ProjectLocksManager: React.FC<ProjectLocksManagerProps> = ({ projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    projectLocks,
    addProjectLock,
    removeProjectLock,
    toggleProjectLock,
  } = useProjectLocks();

  const activeLocks = projectLocks.filter(lock => lock.isActive);

  const handleAddLock = (formData: any) => {
    addProjectLock(formData);
    setShowForm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Verrouillages projet
          {activeLocks.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeLocks.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des verrouillages par jour</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add new lock */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nouveau verrouillage
                </CardTitle>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)} size="sm">
                    Ajouter
                  </Button>
                )}
              </div>
            </CardHeader>
            {showForm && (
              <CardContent>
                <ProjectLockForm
                  projects={projects}
                  onSubmit={handleAddLock}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            )}
          </Card>

          {/* List of locks */}
          <Card>
            <CardHeader>
              <CardTitle>Verrouillages existants</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectLocksList
                locks={projectLocks}
                projects={projects}
                onToggle={toggleProjectLock}
                onDelete={removeProjectLock}
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectLocksManager;
