
import { ProjectInfo, WorkLog, Team } from '@/types/models';
import ProjectReportCard from '@/components/reports/ProjectReportCard';

interface ProjectGridViewProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: Team[];
}

const ProjectGridView = ({ projects, workLogs, teams }: ProjectGridViewProps) => {
  // Safety checks for data
  const validProjects = Array.isArray(projects) ? projects : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {validProjects.map(project => {
        const projectWorkLogs = validWorkLogs.filter(log => log.projectId === project.id);
        const teamName = validTeams.find(t => t.id === project.team)?.name;
        
        return (
          <ProjectReportCard
            key={project.id}
            project={project}
            workLogs={projectWorkLogs}
            teamName={teamName}
          />
        );
      })}
    </div>
  );
};

export default ProjectGridView;
