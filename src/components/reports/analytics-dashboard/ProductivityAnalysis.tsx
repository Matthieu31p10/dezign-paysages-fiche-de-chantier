import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatNumber } from '@/utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, Clock, Target, TrendingUp } from 'lucide-react';

interface ProductivityAnalysisProps {
  teams: { id: string; name: string }[];
  workLogs: WorkLog[];
  projects: ProjectInfo[];
  insights: any;
}

const ProductivityAnalysis: React.FC<ProductivityAnalysisProps> = ({
  teams,
  workLogs,
  projects,
  insights
}) => {
  // Team productivity analysis
  const teamAnalysis = useMemo(() => {
    return teams.map(team => {
      const teamProjects = projects.filter(p => p.team === team.id && !p.isArchived);
      const teamLogs = workLogs.filter(log => 
        teamProjects.some(p => p.id === log.projectId)
      );
      
      const totalHours = teamLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
      const totalVisits = teamLogs.length;
      const avgHoursPerVisit = totalVisits > 0 ? totalHours / totalVisits : 0;
      
      // Calculate efficiency vs planned
      const plannedHours = teamProjects.reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
      const efficiency = plannedHours > 0 ? (totalHours / plannedHours) * 100 : 0;
      
      // Personnel analysis
      const personnelCounts: Record<string, number> = {};
      teamLogs.forEach(log => {
        if (log.personnel && Array.isArray(log.personnel)) {
          log.personnel.forEach(person => {
            personnelCounts[person] = (personnelCounts[person] || 0) + 1;
          });
        }
      });
      
      const uniquePersonnel = Object.keys(personnelCounts).length;
      const totalAssignments = Object.values(personnelCounts).reduce((sum, count) => sum + count, 0);
      
      return {
        teamId: team.id,
        teamName: team.name,
        totalHours,
        totalVisits,
        avgHoursPerVisit,
        efficiency,
        plannedHours,
        uniquePersonnel,
        totalAssignments,
        avgAssignmentsPerPerson: uniquePersonnel > 0 ? totalAssignments / uniquePersonnel : 0,
        projects: teamProjects.length
      };
    }).filter(team => team.totalHours > 0); // Only teams with activity
  }, [teams, workLogs, projects]);

  // Personnel productivity analysis
  const personnelAnalysis = useMemo(() => {
    const personnelStats: Record<string, {
      hours: number;
      visits: number;
      teams: Set<string>;
      projects: Set<string>;
    }> = {};

    workLogs.forEach(log => {
      if (log.personnel && Array.isArray(log.personnel)) {
        log.personnel.forEach(person => {
          if (!personnelStats[person]) {
            personnelStats[person] = {
              hours: 0,
              visits: 0,
              teams: new Set(),
              projects: new Set()
            };
          }
          
          personnelStats[person].hours += log.timeTracking?.totalHours || 0;
          personnelStats[person].visits += 1;
          
          // Find team for this project
          const project = projects.find(p => p.id === log.projectId);
          if (project && project.team) {
            const team = teams.find(t => t.id === project.team);
            if (team) {
              personnelStats[person].teams.add(team.name);
            }
          }
          
          if (log.projectId) {
            personnelStats[person].projects.add(log.projectId);
          }
        });
      }
    });

    return Object.entries(personnelStats)
      .map(([person, stats]) => ({
        name: person,
        hours: stats.hours,
        visits: stats.visits,
        avgHoursPerVisit: stats.visits > 0 ? stats.hours / stats.visits : 0,
        teamsCount: stats.teams.size,
        projectsCount: stats.projects.size,
        teams: Array.from(stats.teams).join(', ')
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Top 10 most active personnel
  }, [workLogs, projects, teams]);

  // Efficiency radar data for teams
  const radarData = useMemo(() => {
    const maxValues = {
      efficiency: Math.max(...teamAnalysis.map(t => t.efficiency), 100),
      avgHours: Math.max(...teamAnalysis.map(t => t.avgHoursPerVisit)),
      productivity: Math.max(...teamAnalysis.map(t => t.totalHours / (t.projects || 1)))
    };

    return teamAnalysis.map(team => ({
      team: team.teamName,
      efficiency: (team.efficiency / maxValues.efficiency) * 100,
      avgHours: (team.avgHoursPerVisit / maxValues.avgHours) * 100,
      productivity: ((team.totalHours / (team.projects || 1)) / maxValues.productivity) * 100
    }));
  }, [teamAnalysis]);

  return (
    <div className="space-y-6">
      {/* Team Productivity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipes actives</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamAnalysis.length}</div>
            <p className="text-xs text-muted-foreground">
              Sur {teams.length} équipes total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel actif</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personnelAnalysis.length}</div>
            <p className="text-xs text-muted-foreground">
              Personnes assignées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficacité moyenne</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamAnalysis.length > 0 ? 
                (teamAnalysis.reduce((sum, t) => sum + t.efficiency, 0) / teamAnalysis.length).toFixed(1) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Vs heures planifiées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivité/h</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.averageHoursPerVisit.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Moyenne par visite
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="teamName" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'totalHours' ? `${formatNumber(value as number)}h` : 
                    name === 'efficiency' ? `${(value as number).toFixed(1)}%` : value,
                    name === 'totalHours' ? 'Heures totales' : 
                    name === 'efficiency' ? 'Efficacité' : name
                  ]}
                />
                <Bar dataKey="totalHours" fill="#3b82f6" name="totalHours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Efficiency Radar */}
        {radarData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analyse comparative des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="team" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="efficiency"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Score']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Team Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse détaillée des équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamAnalysis.map((team, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{team.teamName}</h4>
                  <div className="text-sm text-muted-foreground">
                    {team.projects} projets • {team.uniquePersonnel} personnes
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Heures réalisées</div>
                    <div className="font-bold">{formatNumber(team.totalHours)}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Visites</div>
                    <div className="font-bold">{team.totalVisits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Moy./visite</div>
                    <div className="font-bold">{team.avgHoursPerVisit.toFixed(1)}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Efficacité</div>
                    <div className="font-bold">{team.efficiency.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression vs planifié</span>
                    <span>{formatNumber(team.totalHours)}h / {formatNumber(team.plannedHours)}h</span>
                  </div>
                  <Progress value={Math.min(100, team.efficiency)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Personnel */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel le plus actif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personnelAnalysis.slice(0, 8).map((person, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {person.teamsCount} équipe(s) • {person.projectsCount} projet(s)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatNumber(person.hours)}h</div>
                  <div className="text-sm text-muted-foreground">
                    {person.visits} visites • {person.avgHoursPerVisit.toFixed(1)}h/visite
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityAnalysis;