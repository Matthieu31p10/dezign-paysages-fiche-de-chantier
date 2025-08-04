import { ProjectInfo } from '@/types/models';
import { useEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectListView from './ProjectListView';
import VirtualizedProjectGrid from './VirtualizedProjectGrid';
import VirtualizedProjectList from './VirtualizedProjectList';

interface ProjectsGridProps {
  projects: ProjectInfo[];
  viewMode: 'grid' | 'list';
  onSelectProject: (id: string) => void;
  enableVirtualization?: boolean;
  virtualizationThreshold?: number;
  selectedProjects?: string[];
  onProjectSelection?: (projectId: string, selected: boolean) => void;
  showSelectionMode?: boolean;
}

const ProjectsGrid = ({ 
  projects, 
  viewMode, 
  onSelectProject,
  enableVirtualization = true,
  virtualizationThreshold = 50,
  selectedProjects = [],
  onProjectSelection,
  showSelectionMode = false
}: ProjectsGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 1200, height: 800 });

  // Mesure des dimensions du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerDimensions({
          width: clientWidth || 1200,
          height: Math.max(clientHeight || 800, 600)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (projects.length === 0) {
    return null;
  }

  // Utilise la virtualisation si activée et si le nombre de projets dépasse le seuil
  const shouldVirtualize = enableVirtualization && projects.length > virtualizationThreshold;

  if (viewMode === 'grid') {
    if (shouldVirtualize) {
      return (
        <div ref={containerRef} className="w-full h-full">
          <VirtualizedProjectGrid
            projects={projects}
            onSelectProject={onSelectProject}
            containerWidth={containerDimensions.width}
            containerHeight={containerDimensions.height}
          />
        </div>
      );
    }

    return (
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>
    );
  }

  if (shouldVirtualize) {
    return (
      <div ref={containerRef} className="w-full">
        <VirtualizedProjectList
          projects={projects}
          onSelect={onSelectProject}
          containerHeight={containerDimensions.height}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <ProjectListView
        projects={projects}
        onSelect={onSelectProject}
      />
    </div>
  );
};

export default ProjectsGrid;