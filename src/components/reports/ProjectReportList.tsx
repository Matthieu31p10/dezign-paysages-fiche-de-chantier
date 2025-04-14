
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
  Clock
} from 'lucide-react';
import { ProjectInfo, WorkLog, Team } from '@/types/models';
import { 
  getDaysSinceLastEntry, 
  calculateAverageHoursPerVisit,
  formatDate
} from '@/utils/date-helpers';
import { cn } from '@/lib/utils';

// Create smaller components to improve structure
const ProjectTypeIcon: React.FC<{ projectType: string }> = ({ projectType }) => {
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

const TimeDeviation: React.FC<{ 
  project: ProjectInfo, 
  averageHoursPerVisit: number 
}> = ({ project, averageHoursPerVisit }) => {
  if (!project.visitDuration) {
    return <span>N/A</span>;
  }
  
  const difference = project.visitDuration - averageHoursPerVisit;
  const display = `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} h`;
  const className = difference >= 0 
    ? 'text-green-600 font-medium' 
    : 'text-red-600 font-medium';
    
  return <span className={className}>{display}</span>;
};

const LastVisitCell: React.FC<{
  lastVisitDate: Date | null,
  daysSinceLastVisit: number | null
}> = ({ lastVisitDate, daysSinceLastVisit }) => {
  if (!lastVisitDate) {
    return <span className="text-muted-foreground">Aucun passage</span>;
  }
  
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm">{formatDate(lastVisitDate)}</span>
      <span className="text-xs text-muted-foreground">
        {daysSinceLastVisit !== null ? `(il y a ${daysSinceLastVisit} jours)` : ''}
      </span>
    </div>
  );
};

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
            // Fix: pass projectLogs as array
            const daysSinceLastVisit = getDaysSinceLastEntry(projectLogs);
            
            // Calculate hours with proper types
            const totalHours = projectLogs.reduce((sum, log) => {
              return sum + (log.timeTracking?.totalHours || 0);
            }, 0);
            
            // Calculate average hours - avoid division by zero
            const averageHours = calculateAverageHoursPerVisit(projectLogs);
            
            // Get the date of last visit with proper typing
            const lastVisitDate = projectLogs.length > 0 
              ? new Date(Math.max(...projectLogs.map(log => new Date(log.date).getTime())))
              : null;
            
            return (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center">
                    <ProjectTypeIcon projectType={project.projectType} />
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
                  <TimeDeviation 
                    project={project} 
                    averageHoursPerVisit={averageHours} 
                  />
                </TableCell>
                
                <TableCell className="text-center">
                  <LastVisitCell 
                    lastVisitDate={lastVisitDate}
                    daysSinceLastVisit={daysSinceLastVisit}
                  />
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
