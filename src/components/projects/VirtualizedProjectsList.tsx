import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ProjectInfo } from '@/types/models';
import EnhancedProjectCard from './EnhancedProjectCard';

interface VirtualizedProjectsListProps {
  projects: ProjectInfo[];
  selectedProjects: Set<string>;
  onProjectSelect: (projectId: string) => void;
  onProjectClick: (project: ProjectInfo) => void;
  itemHeight?: number;
  height?: number;
}

export const VirtualizedProjectsList: React.FC<VirtualizedProjectsListProps> = ({
  projects,
  selectedProjects,
  onProjectSelect,
  onProjectClick,
  itemHeight = 200,
  height = 600
}) => {
  const ItemRenderer = useMemo(() => {
    return ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const project = projects[index];
      if (!project) return null;

      return (
        <div style={style} className="p-2">
          <EnhancedProjectCard
            project={project}
            isSelected={selectedProjects.has(project.id)}
            onSelect={() => onProjectSelect(project.id)}
          />
        </div>
      );
    };
  }, [projects, selectedProjects, onProjectSelect, onProjectClick]);

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Aucun projet trouvé
      </div>
    );
  }

  return (
    <List
      height={height}
      width="100%"
      itemCount={projects.length}
      itemSize={itemHeight}
      className="scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
    >
      {ItemRenderer}
    </List>
  );
};