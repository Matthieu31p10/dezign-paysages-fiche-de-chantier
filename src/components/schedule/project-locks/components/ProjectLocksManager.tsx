
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ProjectLocksManager: React.FC<ProjectLocksManagerProps> = ({ 
  projects, 
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Use controlled props if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;
  
  const {
    projectLocks,
    isLoading,
    error,
    addProjectLock,
    removeProjectLock,
    toggleProjectLock,
  } = useProjectLocks();

  console.log('ProjectLocksManager: Projects received:', projects.length);
  console.log('ProjectLocksManager: Project locks:', projectLocks.length);
  console.log('ProjectLocksManager: Loading state:', isLoading);
  console.log('ProjectLocksManager: Error state:', error);

  const activeLocks = projectLocks.filter(lock => lock.isActive);

  const handleAddLock = (formData: any) => {
    console.log('Adding new project lock:', formData);
    addProjectLock(formData);
    setShowForm(false);
  };

  if (isLoading) {
    console.log('ProjectLocksManager: Still loading...');
  }

  // If used as controlled component, render as dialog content only
  if (controlledOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des verrouillages par jour</DialogTitle>
          </DialogHeader>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
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
                <CardTitle>
                  Verrouillages existants 
                  {isLoading && <span className="text-sm text-gray-500 ml-2">(Chargement...)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>Aucun projet disponible pour les verrouillages</p>
                  </div>
                ) : (
                  <ProjectLocksList
                    locks={projectLocks}
                    projects={projects}
                    onToggle={toggleProjectLock}
                    onDelete={removeProjectLock}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Original trigger button behavior
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Lock className="h-4 w-4" />
        Verrouillages projet
        {activeLocks.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeLocks.length}
          </Badge>
        )}
      </Button>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des verrouillages par jour</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
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
              <CardTitle>
                Verrouillages existants 
                {isLoading && <span className="text-sm text-gray-500 ml-2">(Chargement...)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>Aucun projet disponible pour les verrouillages</p>
                </div>
              ) : (
                <ProjectLocksList
                  locks={projectLocks}
                  projects={projects}
                  onToggle={toggleProjectLock}
                  onDelete={removeProjectLock}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectLocksManager;
