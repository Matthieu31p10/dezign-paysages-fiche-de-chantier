import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface ProjectsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ProjectsViewToggle = ({ viewMode, onViewModeChange }: ProjectsViewToggleProps) => {
  return (
    <div className="border rounded-md flex">
      <Button 
        variant={viewMode === 'grid' ? "secondary" : "ghost"} 
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button 
        variant={viewMode === 'list' ? "secondary" : "ghost"} 
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="px-3"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProjectsViewToggle;