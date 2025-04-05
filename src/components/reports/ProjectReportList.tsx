
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building2, 
  Home, 
  Landmark, 
  Users, 
  Clock, 
  Calendar
} from 'lucide-react';
import { ProjectInfo, WorkLog, Team } from '@/types/models';
import { 
  getDaysSinceLastEntry, 
  calculateAverageHoursPerVisit,
  formatDate
} from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectReportListProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: Team[];
}

const ProjectReportList: React.FC<ProjectReportListProps> = ({ 
  projects, 
  workLogs, 
  teams 
}) => {
  // Helper function to calculate time deviation
  const calculateTimeDeviation = (project: ProjectInfo, projectLogs: WorkLog[]): { 
    value: number | null;
    display: string;
    className: string;
  } => {
    if (!project || projectLogs.length === 0) {
      return { value: null, display: "N/A", className: "" };
    }
    
    const totalHours = projectLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
    const averageHoursPerVisit = totalHours / projectLogs.length;
    
    if (!project.visitDuration) {
      return { value: null, display: "N/A", className: "" };
    }
    
    const difference = project.visitDuration - averageHoursPerVisit;
    const display = `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} h`;
    const className = difference >= 0 
      ? 'text-green-600 font-medium' 
      : 'text-red-600 font-medium';
      
    return { value: difference, display, className };
  };
  
  // Get project type icon
  const getProjectTypeIcon = (projectType: string) => {
    switch (projectType) {
      case 'residence':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'particular':
        return <Home className="h-4 w-4 text-blue-400" />;
      case 'enterprise':
        return <Landmark className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Chantier</TableHead>
            <TableHead>Équipe</TableHead>
            <TableHead className="text-center">Passages</TableHead>
            <TableHead className="text-center">Heures utilisées</TableHead>
            <TableHead className="text-center">Temps moyen</TableHead>
            <TableHead className="text-center">Écart du temps</TableHead>
            <TableHead className="text-center">Dernier passage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => {
            const projectLogs = workLogs.filter(log => log.projectId === project.id);
            const teamName = teams.find(t => t.id === project.team)?.name;
            const daysSinceLastVisit = getDaysSinceLastEntry(projectLogs);
            const averageHours = calculateAverageHoursPerVisit(projectLogs);
            const totalHours = projectLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
            
            const timeDeviation = calculateTimeDeviation(project, projectLogs);
            
            // Get the date of last visit
            const lastVisitDate = projectLogs.length > 0 
              ? new Date(Math.max(...projectLogs.map(log => new Date(log.date).getTime())))
              : null;
            
            return (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center">
                    {getProjectTypeIcon(project.projectType)}
                    <span className="ml-2 font-medium">{project.name}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {teamName ? (
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {teamName}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-medium">{projectLogs.length} / {project.annualVisits}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-medium">{totalHours.toFixed(1)} / {project.annualTotalHours}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-medium">{averageHours.toFixed(1)} h</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className={timeDeviation.className}>
                    {timeDeviation.display}
                  </span>
                </TableCell>
                
                <TableCell className="text-center">
                  {lastVisitDate ? (
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{formatDate(lastVisitDate)}</span>
                      <span className="text-xs text-muted-foreground">
                        (il y a {daysSinceLastVisit} jours)
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Aucun passage</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectReportList;
