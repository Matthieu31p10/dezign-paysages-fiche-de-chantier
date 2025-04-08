
import { ProjectInfo, WorkLog } from '@/types/models';
import { formatNumber } from '@/utils/helpers';
import { Calendar, Users } from 'lucide-react';
import StatCard from './StatCard';
import ProgressList from './ProgressList';

interface ProjectsOverviewProps {
  projects: ProjectInfo[];
  filteredLogs: WorkLog[];
  teams: { id: string; name: string }[];
}

const ProjectsOverview = ({ projects, filteredLogs, teams }: ProjectsOverviewProps) => {
  // Total metrics
  const totalPlannedVisits = projects.reduce((sum, project) => sum + (project.annualVisits || 0), 0);
  const totalCompletedVisits = filteredLogs.length;
  const completionRate = totalPlannedVisits > 0 
    ? Math.round((totalCompletedVisits / totalPlannedVisits) * 100) 
    : 0;
  
  const totalPlannedHours = projects.reduce((sum, project) => sum + (project.annualTotalHours || 0), 0);
  const totalCompletedHours = filteredLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
  const hoursCompletionRate = totalPlannedHours > 0 
    ? Math.round((totalCompletedHours / totalPlannedHours) * 100) 
    : 0;
  
  // Project with most visits
  const projectVisitCounts = projects.map(project => {
    const visits = filteredLogs.filter(log => log.projectId === project.id).length;
    return { id: project.id, name: project.name, visits };
  });
  
  const projectWithMostVisits = projectVisitCounts.sort((a, b) => b.visits - a.visits)[0] || { visits: 0 };
  
  // Team statistics
  const teamWorkLogs = teams.map(team => {
    const teamProjects = projects.filter(project => project.team === team.id);
    const teamProjectIds = teamProjects.map(p => p.id);
    const logs = filteredLogs.filter(log => teamProjectIds.includes(log.projectId));
    
    return {
      id: team.id,
      name: team.name,
      visits: logs.length,
      hours: logs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0),
    };
  });
  
  const teamWithMostWork = teamWorkLogs.sort((a, b) => b.hours - a.hours)[0] || { hours: 0 };

  // Progress list items for projects
  const projectProgressItems = projectVisitCounts
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)
    .map(project => ({
      key: project.id,
      label: project.name,
      value: `${project.visits} visites`,
      progress: Math.min(100, (project.visits / (projectWithMostVisits?.visits || 1)) * 100)
    }));

  // Progress list items for teams
  const teamProgressItems = teamWorkLogs
    .sort((a, b) => b.hours - a.hours)
    .map(team => ({
      key: team.id,
      label: team.name,
      value: `${formatNumber(team.hours)} h`,
      progress: Math.min(100, (team.hours / (teamWithMostWork?.hours || 1)) * 100)
    }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Projets" 
          value={projects.length}
          subtitle="Chantiers actifs"
        />
        
        <StatCard 
          title="Passages" 
          value={totalCompletedVisits}
          supplementalValue={totalPlannedVisits.toString()}
          progress={completionRate}
          subtitle={`${completionRate}% des passages prévus`}
        />
        
        <StatCard 
          title="Heures travaillées" 
          value={formatNumber(totalCompletedHours)}
          supplementalValue={formatNumber(totalPlannedHours)}
          progress={hoursCompletionRate}
          subtitle={`${hoursCompletionRate}% des heures prévues`}
        />
        
        <StatCard 
          title="Équipes" 
          value={teams.length}
          subtitle="Équipes actives"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressList
          title="Chantiers les plus visités"
          icon={<Calendar className="w-5 h-5" />}
          items={projectProgressItems}
          emptyMessage="Aucun chantier visité"
        />
        
        <ProgressList
          title="Activité par équipe"
          icon={<Users className="w-5 h-5" />}
          items={teamProgressItems}
          emptyMessage="Aucune activité d'équipe"
        />
      </div>
    </>
  );
};

export default ProjectsOverview;
