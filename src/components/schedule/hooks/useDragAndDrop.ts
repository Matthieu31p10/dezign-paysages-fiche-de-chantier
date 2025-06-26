
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface DraggedProject {
  id: string;
  name: string;
  type: 'ponctuel';
  originalDate?: string;
}

export const useDragAndDrop = () => {
  const [draggedProject, setDraggedProject] = useState<DraggedProject | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const handleDragStart = useCallback((project: DraggedProject) => {
    setDraggedProject(project);
    console.log('Début du glissement:', project.name);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedProject(null);
    setIsDropZoneActive(false);
    console.log('Fin du glissement');
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDropZoneActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDropZoneActive(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent, targetDate: string) => {
    event.preventDefault();
    setIsDropZoneActive(false);
    
    if (draggedProject) {
      console.log(`Chantier ${draggedProject.name} déplacé vers ${targetDate}`);
      toast.success(
        `Chantier "${draggedProject.name}" programmé`,
        {
          description: `Nouvelle date: ${new Date(targetDate).toLocaleDateString('fr-FR')}`,
          duration: 3000
        }
      );
      setDraggedProject(null);
    }
  }, [draggedProject]);

  return {
    draggedProject,
    isDropZoneActive,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
