
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Clock, Calendar, Users } from 'lucide-react';

interface GlobalStatsProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: { id: string; name: string }[];
  selectedYear: number;
}

const GlobalStats = ({ projects, workLogs, teams, selectedYear }: GlobalStatsProps) => {
  // Filter work logs by year
  const yearFilteredLogs = workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === selectedYear;
  });
  
  // Total metrics
  const totalPlannedVisits = projects.reduce((sum, project) => sum + project.annualVisits, 0);
  const totalCompletedVisits = yearFilteredLogs.length;
  const completionRate = totalPlannedVisits > 0 
    ? Math.round((totalCompletedVisits / totalPlannedVisits) * 100) 
    : 0;
  
  const totalPlannedHours = projects.reduce((sum, project) => sum + project.annualTotalHours, 0);
  const totalCompletedHours = yearFilteredLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
  const hoursCompletionRate = totalPlannedHours > 0 
    ? Math.round((totalCompletedHours / totalPlannedHours) * 100) 
    : 0;
  
  // Task statistics
  const taskStats = {
    mowing: yearFilteredLogs.filter(log => log.tasksPerformed.mowing).length,
    brushcutting: yearFilteredLogs.filter(log => log.tasksPerformed.brushcutting).length,
    blower: yearFilteredLogs.filter(log => log.tasksPerformed.blower).length,
    manualWeeding: yearFilteredLogs.filter(log => log.tasksPerformed.manualWeeding).length,
    whiteVinegar: yearFilteredLogs.filter(log => log.tasksPerformed.whiteVinegar).length,
    pruning: yearFilteredLogs.filter(log => log.tasksPerformed.pruning.done).length,
  };
  
  // Get task statistics in descending order
  const sortedTasks = Object.entries(taskStats)
    .sort((a, b) => b[1] - a[1])
    .map(([task, count]) => ({
      name: task === 'mowing' ? 'Tonte' : 
           task === 'brushcutting' ? 'Débroussaillage' :
           task === 'blower' ? 'Souffleur' :
           task === 'manualWeeding' ? 'Désherbage' :
           task === 'whiteVinegar' ? 'Vinaigre' :
           'Taille',
      count
    }));
  
  // Project with most visits
  const projectVisitCounts = projects.map(project => {
    const visits = yearFilteredLogs.filter(log => log.projectId === project.id).length;
    return { id: project.id, name: project.name, visits };
  });
  
  const projectWithMostVisits = projectVisitCounts.sort((a, b) => b.visits - a.visits)[0];
  
  // Team statistics
  const teamWorkLogs = teams.map(team => {
    const teamProjects = projects.filter(project => project.team === team.id);
    const teamProjectIds = teamProjects.map(p => p.id);
    const logs = yearFilteredLogs.filter(log => teamProjectIds.includes(log.projectId));
    
    return {
      id: team.id,
      name: team.name,
      visits: logs.length,
      hours: logs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0),
    };
  });
  
  const teamWithMostWork = teamWorkLogs.sort((a, b) => b.hours - a.hours)[0];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Chantiers actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {totalCompletedVisits}
              <span className="text-xs font-normal text-muted-foreground ml-2">
                / {totalPlannedVisits}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1 mt-2">
              <div
                className="bg-primary h-1 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate}% des passages prévus
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Heures travaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {formatNumber(totalCompletedHours)}
              <span className="text-xs font-normal text-muted-foreground ml-2">
                / {formatNumber(totalPlannedHours)}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1 mt-2">
              <div
                className="bg-primary h-1 rounded-full"
                style={{ width: `${hoursCompletionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hoursCompletionRate}% des heures prévues
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Équipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{teams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Équipes actives
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-primary" />
              Activités les plus fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTasks.slice(0, 5).map((task, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{task.name}</span>
                    <Badge variant="outline" className="bg-brand-50 text-brand-700">
                      {task.count} fois
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (task.count / totalCompletedVisits) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Chantiers les plus visités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectVisitCounts
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 5)
                .map((project, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[70%]">{project.name}</span>
                      <Badge variant="outline" className="bg-brand-50 text-brand-700">
                        {project.visits} visites
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (project.visits / 
                            (projectWithMostVisits?.visits || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Activité par équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamWorkLogs
                .sort((a, b) => b.hours - a.hours)
                .map((team, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[70%]">{team.name}</span>
                      <Badge variant="outline" className="bg-brand-50 text-brand-700">
                        {formatNumber(team.hours)} h
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (team.hours / 
                            (teamWithMostWork?.hours || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalStats;
