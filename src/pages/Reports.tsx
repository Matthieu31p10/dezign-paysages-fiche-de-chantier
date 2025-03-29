
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectReportCard from '@/components/reports/ProjectReportCard';
import GlobalStats from '@/components/reports/GlobalStats';
import PDFGenerator from '@/components/reports/PDFGenerator';
import CalendarView from '@/components/worklogs/CalendarView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, BarChart2, Calendar, FileText, Clock, Users } from 'lucide-react';
import { getDaysSinceLastEntry, getCurrentYear, getYearsFromWorkLogs } from '@/utils/helpers';

const Reports = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Filter projects by team
  const filteredProjects = selectedTeam === 'all'
    ? projectInfos
    : projectInfos.filter(project => project.team === selectedTeam);
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'lastVisit') {
      const logsA = workLogs.filter(log => log.projectId === a.id);
      const logsB = workLogs.filter(log => log.projectId === b.id);
      
      const daysA = getDaysSinceLastEntry(logsA) || Number.MAX_SAFE_INTEGER;
      const daysB = getDaysSinceLastEntry(logsB) || Number.MAX_SAFE_INTEGER;
      
      return daysA - daysB;
    }
    return 0;
  });
  
  // Get non-archived projects for stats
  const activeProjects = projectInfos.filter(project => !project.isArchived);
  
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
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrer par équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {teams.map(team => (
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
            
            <div className="w-full sm:w-auto ml-0 sm:ml-auto">
              <Select
                value={sortOption}
                onValueChange={setSortOption}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProjects.map(project => {
                const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
                const teamName = teams.find(t => t.id === project.team)?.name;
                
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
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <GlobalStats 
            projects={activeProjects} 
            workLogs={workLogs} 
            teams={teams} 
            selectedYear={selectedYear} 
          />
        </TabsContent>
        
        <TabsContent value="tools" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PDFGenerator />
          <CalendarView workLogs={workLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
