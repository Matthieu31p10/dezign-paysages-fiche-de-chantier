import { ProjectInfo } from '@/types/models';
import ProjectCard from './ProjectCard';
import ProjectListView from './ProjectListView';

interface ProjectsGridProps {
  projects: ProjectInfo[];
  viewMode: 'grid' | 'list';
  onSelectProject: (id: string) => void;
}

const ProjectsGrid = ({ projects, viewMode, onSelectProject }: ProjectsGridProps) => {
  if (projects.length === 0) {
    return null;
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>
    );
  }

  return (
    <ProjectListView
      projects={projects}
      onSelect={onSelectProject}
    />
  );
};

export default ProjectsGrid;