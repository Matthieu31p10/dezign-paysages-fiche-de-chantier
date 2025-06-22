
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, List } from 'lucide-react';
import ProjectLocksManager from '../project-locks/components/ProjectLocksManager';
import { ProjectInfo } from '@/types/models';

interface PlanningControlsProps {
  projects: ProjectInfo[];
  viewMode: 'calendar' | 'list';
  showWeekends: boolean;
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  onShowWeekendsChange: (show: boolean) => void;
}

const PlanningControls: React.FC<PlanningControlsProps> = ({
  projects,
  viewMode,
  showWeekends,
  onViewModeChange,
  onShowWeekendsChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <ProjectLocksManager projects={projects} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewModeChange(viewMode === 'calendar' ? 'list' : 'calendar')}
          className="flex items-center gap-2"
        >
          {viewMode === 'calendar' ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          {viewMode === 'calendar' ? 'Vue liste' : 'Vue calendrier'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="show-weekends"
          checked={showWeekends}
          onCheckedChange={onShowWeekendsChange}
        />
        <Label htmlFor="show-weekends" className="text-sm">Week-ends</Label>
      </div>
    </div>
  );
};

export default PlanningControls;
