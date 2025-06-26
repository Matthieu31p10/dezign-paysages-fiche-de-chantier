
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DraggableProjectItem from './DraggableProjectItem';

interface OneTimeProject {
  id: string;
  name: string;
  address: string;
  visitDuration: number;
  type: string;
}

interface OneTimeProjectsSidebarProps {
  projects: OneTimeProject[];
  onAddProject?: () => void;
}

const OneTimeProjectsSidebar: React.FC<OneTimeProjectsSidebarProps> = ({ 
  projects, 
  onAddProject 
}) => {
  const oneTimeProjects = projects.filter(p => p.type === 'ponctuel');

  return (
    <Card className="w-80 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-blue-600" />
          Chantiers ponctuels
        </CardTitle>
        <p className="text-sm text-gray-600">
          Glissez-déposez pour programmer
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {oneTimeProjects.length > 0 ? (
          oneTimeProjects.map(project => (
            <DraggableProjectItem key={project.id} project={project} />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun chantier ponctuel</p>
          </div>
        )}
        
        {onAddProject && (
          <Button 
            onClick={onAddProject} 
            variant="outline" 
            className="w-full mt-3"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un chantier ponctuel
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OneTimeProjectsSidebar;
