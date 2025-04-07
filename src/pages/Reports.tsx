
import { useState, useTransition } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectReportCard from '@/components/reports/ProjectReportCard';
import ProjectReportList from '@/components/reports/ProjectReportList';
import GlobalStats from '@/components/reports/GlobalStats';
import PDFGenerator from '@/components/reports/PDFGenerator';
import CalendarView from '@/components/worklogs/CalendarView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, BarChart2, Calendar, FileText, Clock, Users, LayoutGrid, List } from 'lucide-react';
import { getDaysSinceLastEntry, getCurrentYear, getYearsFromWorkLogs } from '@/utils/helpers';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Reports = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [isPending, startTransition] = useTransition();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
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
  
  // Get non-archived projects for stats
  const activeProjects = validProjectInfos.filter(project => !project.isArchived);
  
  // Get available years for filtering
  const availableYears = getYearsFromWorkLogs(validWorkLogs);

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

  const handleYearChange = (value: string) => {
    startTransition(() => {
      setSelectedYear(parseInt(value));
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Bilans</h1>
        <p className="text-muted-foreground">
          Consultez les statistiques et rapports de vos chantiers
        </p>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>Chantiers</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Outils</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="flex justify-end mb-4">
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <GlobalStats 
            projects={activeProjects} 
            workLogs={validWorkLogs} 
            teams={validTeams} 
            selectedYear={selectedYear} 
          />
        </TabsContent>
        
        <TabsContent value="tools" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PDFGenerator />
          <CalendarView workLogs={validWorkLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
