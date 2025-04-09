
import { Card, CardContent } from '@/components/ui/card';
import { Team, ProjectInfo, WorkLog } from '@/types/models';
import { useMemo } from 'react';

interface TeamTotalsTableProps {
  teams: Team[];
  projectInfos: ProjectInfo[];
  workLogs: WorkLog[];
}

const TeamTotalsTable = ({ teams, projectInfos, workLogs }: TeamTotalsTableProps) => {
  // Calculate totals
  const teamTotals = useMemo(() => {
    const result = teams.map(team => {
      const teamProjects = projectInfos.filter(p => p.team === team.id);
      const annualVisits = teamProjects.reduce((sum, p) => sum + p.annualVisits, 0);
      const annualHours = teamProjects.reduce((sum, p) => sum + p.annualTotalHours, 0);
      
      // Heures réalisées
      const teamLogs = workLogs.filter(log => {
        const projectId = log.projectId;
        const project = projectInfos.find(p => p.id === projectId);
        return project && project.team === team.id;
      });
      
      const completedHours = teamLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
      
      return {
        teamId: team.id,
        teamName: team.name,
        projectCount: teamProjects.length,
        annualVisits,
        annualHours,
        completedHours,
        completionRate: annualHours > 0 ? Math.round((completedHours / annualHours) * 100) : 0
      };
    });
    
    // Total global
    const totalProjects = projectInfos.length;
    const totalAnnualVisits = projectInfos.reduce((sum, p) => sum + p.annualVisits, 0);
    const totalAnnualHours = projectInfos.reduce((sum, p) => sum + p.annualTotalHours, 0);
    const totalCompletedHours = workLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    
    result.unshift({
      teamId: 'all',
      teamName: 'Total global',
      projectCount: totalProjects,
      annualVisits: totalAnnualVisits,
      annualHours: totalAnnualHours,
      completedHours: totalCompletedHours,
      completionRate: totalAnnualHours > 0 ? Math.round((totalCompletedHours / totalAnnualHours) * 100) : 0
    });
    
    return result;
  }, [projectInfos, workLogs, teams]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Équipe</th>
                <th className="text-center py-2 font-medium">Chantiers</th>
                <th className="text-center py-2 font-medium">Visites prévues</th>
                <th className="text-center py-2 font-medium">Heures prévues</th>
                <th className="text-center py-2 font-medium">Heures réalisées</th>
                <th className="text-center py-2 font-medium">Taux complétion</th>
              </tr>
            </thead>
            <tbody>
              {teamTotals.map(team => (
                <tr key={team.teamId} className="border-b hover:bg-muted/50">
                  <td className="py-2 font-medium">
                    {team.teamId === 'all' ? (
                      <span className="font-semibold">{team.teamName}</span>
                    ) : (
                      team.teamName
                    )}
                  </td>
                  <td className="text-center py-2">{team.projectCount}</td>
                  <td className="text-center py-2">{team.annualVisits}</td>
                  <td className="text-center py-2">{team.annualHours}h</td>
                  <td className="text-center py-2">{team.completedHours.toFixed(1)}h</td>
                  <td className="text-center py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${team.completionRate}%` }}
                        ></div>
                      </div>
                      <span>{team.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamTotalsTable;
