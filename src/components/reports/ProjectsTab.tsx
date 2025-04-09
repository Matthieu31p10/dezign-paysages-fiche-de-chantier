
import { useState, useTransition, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { getDaysSinceLastEntry } from '@/utils/helpers';
import ProjectGridView from '@/components/reports/ProjectGridView';
import ProjectReportList from '@/components/reports/ProjectReportList';
import ProjectFilters from '@/components/reports/ProjectFilters';
import EmptyProjectsState from '@/components/reports/EmptyProjectsState';
import { Card, CardContent } from '@/components/ui/card';

const ProjectsTab = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [isPending, startTransition] = useTransition();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [viewMode, setViewMode] = useState<string>('grid');
  
  // Safety checks for data
  const validProjectInfos = Array.isArray(projectInfos) ? projectInfos : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];
  
  // Get unique project types
  const projectTypes = useMemo(() => {
    const types = validProjectInfos
      .map(project => project.projectType)
      .filter(Boolean) as string[];
    return [...new Set(types)];
  }, [validProjectInfos]);

  // Filter projects by team and type
  const filteredProjects = validProjectInfos.filter(project => {
    const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
    const matchesType = selectedProjectType === 'all' || project.projectType === selectedProjectType;
    return matchesTeam && matchesType;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'lastVisit') {
      const logsA = validWorkLogs.filter(log => log.projectId === a.id);
      const logsB = validWorkLogs.filter(log => log.projectId === b.id);
      
      const daysA = getDaysSinceLastEntry(logsA) || Number.MAX_SAFE_INTEGER;
      const daysB = getDaysSinceLastEntry(logsB) || Number.MAX_SAFE_INTEGER;
      
      return daysA - daysB;
    }
    return 0;
  });

  // Calculate totals
  const teamTotals = useMemo(() => {
    const result = validTeams.map(team => {
      const teamProjects = validProjectInfos.filter(p => p.team === team.id);
      const annualVisits = teamProjects.reduce((sum, p) => sum + p.annualVisits, 0);
      const annualHours = teamProjects.reduce((sum, p) => sum + p.annualTotalHours, 0);
      
      // Heures réalisées
      const teamLogs = validWorkLogs.filter(log => {
        const projectId = log.projectId;
        const project = validProjectInfos.find(p => p.id === projectId);
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
    const totalProjects = validProjectInfos.length;
    const totalAnnualVisits = validProjectInfos.reduce((sum, p) => sum + p.annualVisits, 0);
    const totalAnnualHours = validProjectInfos.reduce((sum, p) => sum + p.annualTotalHours, 0);
    const totalCompletedHours = validWorkLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    
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
  }, [validProjectInfos, validWorkLogs, validTeams]);

  // Handlers with startTransition
  const handleTeamChange = (value: string) => {
    startTransition(() => {
      setSelectedTeam(value);
    });
  };

  const handleProjectTypeChange = (value: string) => {
    startTransition(() => {
      setSelectedProjectType(value);
    });
  };

  const handleSortChange = (value: string) => {
    startTransition(() => {
      setSortOption(value);
    });
  };

  const handleViewModeChange = (value: string) => {
    if (value) {
      startTransition(() => {
        setViewMode(value);
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <ProjectFilters
        teams={validTeams}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        projectTypes={projectTypes}
        selectedProjectType={selectedProjectType}
        onProjectTypeChange={handleProjectTypeChange}
      />
      
      {/* Résumé par équipe */}
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
      
      {filteredProjects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        viewMode === 'grid' ? (
          <ProjectGridView
            projects={sortedProjects}
            workLogs={validWorkLogs}
            teams={validTeams}
          />
        ) : (
          <ProjectReportList
            projects={sortedProjects}
            workLogs={validWorkLogs}
            teams={validTeams}
          />
        )
      )}
    </div>
  );
};

export default ProjectsTab;
