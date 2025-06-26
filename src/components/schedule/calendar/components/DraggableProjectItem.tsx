
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Calendar } from 'lucide-react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface DraggableProjectItemProps {
  project: {
    id: string;
    name: string;
    type: string;
    address: string;
    visitDuration: number;
  };
}

const DraggableProjectItem: React.FC<DraggableProjectItemProps> = ({ project }) => {
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  const onDragStart = (event: React.DragEvent) => {
    handleDragStart({
      id: project.id,
      name: project.name,
      type: 'ponctuel'
    });
    
    // Set drag effect
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', project.id);
  };

  return (
    <Card 
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-dashed border-2 border-blue-300 bg-blue-50"
      draggable
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <Calendar className="h-4 w-4 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {project.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {project.address}
            </p>
            <p className="text-xs text-blue-600">
              Durée: {project.visitDuration}h - Chantier ponctuel
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableProjectItem;
