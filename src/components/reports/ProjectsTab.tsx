
import { useState, useTransition } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import ProjectReportCard from '@/components/reports/ProjectReportCard';
import ProjectReportList from '@/components/reports/ProjectReportList';
import { Building2, LayoutGrid, List, Users } from 'lucide-react';
import { getDaysSinceLastEntry } from '@/utils/helpers';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProjectsTab = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [isPending, startTransition] = useTransition();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [viewMode, setViewMode] = useState<string>('grid');
  
  // Safety checks for data
  const validProjectInfos = Array.isArray(projectInfos) ? projectInfos : [];
  const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
  const validTeams = Array.isArray(teams) ? teams : [];
  
  // Filter projects by team
  const filteredProjects = selectedTeam === 'all'
    ? validProjectInfos
    : validProjectInfos.filter(project => project.team === selectedTeam);
  
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

  // Handlers with startTransition
  const handleTeamChange = (value: string) => {
    startTransition(() => {
      setSelectedTeam(value);
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-auto">
          <Select
            value={selectedTeam}
            onValueChange={handleTeamChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrer par équipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {validTeams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {team.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={handleViewModeChange}
          className="border rounded-md hidden sm:flex"
        >
          <ToggleGroupItem value="grid" aria-label="Vue en grille">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vue en liste">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="w-full sm:w-auto ml-0 sm:ml-auto">
          <Select
            value={sortOption}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="lastVisit">Dernier passage (récent-ancien)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Aucun chantier trouvé pour cette équipe
            </p>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProjects.map(project => {
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
