
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectInfo } from '@/types/models';

interface ProjectSelectorProps {
  projectInfos: ProjectInfo[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projectInfos,
  selectedProject,
  onProjectChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="project">Chantier</Label>
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un chantier" />
        </SelectTrigger>
        <SelectContent>
          {projectInfos.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name} - {project.address}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelector;
