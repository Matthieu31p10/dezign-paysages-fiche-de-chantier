import { useState, useEffect } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, filterWorkLogsByYear } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Clock, Calendar, Users, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GlobalStatsProps {
  projects: ProjectInfo[];  // These are already filtered projects (non archived)
  workLogs: WorkLog[];      // Logs filtered by year and active projects
  teams: { id: string; name: string }[];
  selectedYear: number;
}

interface PersonnelHours {
  name: string;
  hours: number;
}

interface TaskCount {
  id: string;
  name: string;
  count: number;
}

const GlobalStats = ({ projects, workLogs, teams, selectedYear }: GlobalStatsProps) => {
  const [filteredLogs, setFilteredLogs] = useState<WorkLog[]>([]);
  const [statView, setStatView] = useState<'main' | 'personnel'>('main');
  
  // Filter logs by selected year when component mounts or when selectedYear changes
  useEffect(() => {
    if (!workLogs || !Array.isArray(workLogs)) {
      setFilteredLogs([]);
      return;
    }
    setFilteredLogs(filterWorkLogsByYear(workLogs, selectedYear));
  }, [workLogs, selectedYear]);
  
  // Ensure we have valid data to work with
  if (!projects || !Array.isArray(projects) || !workLogs || !Array.isArray(workLogs) || !teams || !Array.isArray(teams)) {
    return <div className="p-4 text-center">Chargement des données...</div>;
  }
  
  // Total metrics - all calculations are now on already filtered data
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
  
  // Count custom tasks and their frequency
  const taskCounts: { [id: string]: TaskCount } = {};
  
  filteredLogs.forEach(log => {
    if (log.tasksPerformed?.customTasks) {
      Object.entries(log.tasksPerformed.customTasks).forEach(([taskId, isDone]) => {
        if (isDone) {
          if (!taskCounts[taskId]) {
            taskCounts[taskId] = {
              id: taskId,
              name: `Tâche ${taskId.slice(0, 4)}`, // Default name
              count: 0
            };
          }
          taskCounts[taskId].count++;
        }
      });
    }
  });
  
  // Get task statistics in descending order
  const sortedTasks = Object.values(taskCounts)
    .sort((a, b) => b.count - a.count)
    .map(task => ({
      name: task.name,
      count: task.count
    }));
  
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
  
  // Personnel statistics - extract all unique personnel from work logs
  // For each log, divide the total hours by the number of personnel
  const personnelHours: PersonnelHours[] = [];
  
  filteredLogs.forEach(log => {
    if (log.personnel && Array.isArray(log.personnel) && log.personnel.length > 0) {
      // Calculate hours per person by dividing the total hours by the number of personnel
      const hoursPerPerson = log.timeTracking.totalHours / log.personnel.length;
      
      log.personnel.forEach(person => {
        const personIndex = personnelHours.findIndex(p => p.name === person);
        if (personIndex >= 0) {
          personnelHours[personIndex].hours += hoursPerPerson;
        } else {
          personnelHours.push({
            name: person,
            hours: hoursPerPerson
          });
        }
      });
    }
  });
  
  // Sort personnel by hours worked (descending)
  const sortedPersonnel = personnelHours.sort((a, b) => b.hours - a.hours);
  const personWithMostHours = sortedPersonnel[0] || { name: '', hours: 0 };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="main" className="w-full mb-4" onValueChange={(value) => setStatView(value as 'main' | 'personnel')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Chantiers</span>
          </TabsTrigger>
          <TabsTrigger value="personnel" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>Personnel</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {statView === 'main' ? (
        <>
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
                          style={{ width: `${Math.min(100, (task.count / (totalCompletedVisits || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {sortedTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Aucune donnée d'activité disponible
                    </p>
                  )}
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
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{personnelHours.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Membres actifs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Heures totales travaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatNumber(totalCompletedHours)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur tous les chantiers
                </p>
              </CardContent>
            </Card>
            
            {personWithMostHours && personWithMostHours.hours > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Membre le plus actif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold truncate">{personWithMostHours.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatNumber(personWithMostHours.hours)} heures
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Heures travaillées par membre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedPersonnel.map((person, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[70%]">{person.name}</span>
                      <Badge variant="outline" className="bg-brand-50 text-brand-700">
                        {formatNumber(person.hours)} h
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (person.hours / 
                            (personWithMostHours.hours || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                {sortedPersonnel.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune donnée de personnel disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GlobalStats;
