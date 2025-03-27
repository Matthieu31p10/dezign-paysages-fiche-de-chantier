
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getCurrentYear } from '@/utils/helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlobalStats from '@/components/reports/GlobalStats';
import ProjectReportCard from '@/components/reports/ProjectReportCard';
import { BarChart3, Calendar, Building2, Home, Landmark, Users } from 'lucide-react';

const Reports = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Get available years from work logs
  const currentYear = getCurrentYear();
  const availableYears = [currentYear];
  
  // Add past years if we have work logs for them
  workLogs.forEach(log => {
    const year = new Date(log.date).getFullYear();
    if (!availableYears.includes(year)) {
      availableYears.push(year);
    }
  });
  
  // Sort years descending
  availableYears.sort((a, b) => b - a);
  
  // Filter out archived projects FIRST - always exclude them from all calculations
  const activeProjects = projectInfos.filter(project => !project.isArchived);
  
  // Filter work logs by year
  const yearFilteredLogs = workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === selectedYear;
  });
  
  // Only include logs that belong to active (non-archived) projects
  const activeProjectIds = activeProjects.map(project => project.id);
  const activeYearFilteredLogs = yearFilteredLogs.filter(log => 
    activeProjectIds.includes(log.projectId)
  );
  
  // Then filter projects by team and type
  const filteredProjects = activeProjects.filter(project => {
    const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
    const matchesType = selectedType === 'all' || project.projectType === selectedType;
    return matchesTeam && matchesType;
  });
  
  // Final filtered logs based on team/type filters
  const finalFilteredLogs = activeYearFilteredLogs.filter(log => {
    const project = activeProjects.find(p => p.id === log.projectId);
    if (!project) return false;
    
    const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
    const matchesType = selectedType === 'all' || project.projectType === selectedType;
    return matchesTeam && matchesType;
  });
  
  // Group work logs by project - use filtered projects to avoid processing archived ones
  const projectWorkLogs = filteredProjects.map(project => ({
    project,
    logs: activeYearFilteredLogs.filter(log => log.projectId === project.id),
  }));
  
  // Sort by most active projects first
  projectWorkLogs.sort((a, b) => b.logs.length - a.logs.length);
  
  const getProjectTypeIcon = (type: string) => {
    switch (type) {
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bilans</h1>
          <p className="text-muted-foreground">
            Consultez les bilans de vos chantiers actifs
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-24">
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
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedTeam}
            onValueChange={setSelectedTeam}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Équipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type de chantier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="residence">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span>Résidence</span>
                </div>
              </SelectItem>
              <SelectItem value="particular">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-400" />
                  <span>Particulier</span>
                </div>
              </SelectItem>
              <SelectItem value="enterprise">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-orange-500" />
                  <span>Entreprise</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <GlobalStats
        projects={filteredProjects}
        workLogs={yearFilteredLogs}
        teams={teams}
        selectedYear={selectedYear}
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Bilans par chantier</CardTitle>
          </div>
          <CardDescription>
            {`Progression des chantiers actifs pour l'année ${selectedYear}`}
            {selectedTeam !== 'all' && ` - Équipe: ${teams.find(t => t.id === selectedTeam)?.name}`}
            {selectedType !== 'all' && ` - Type: ${
              selectedType === 'residence' ? 'Résidence' : 
              selectedType === 'particular' ? 'Particulier' :
              selectedType === 'enterprise' ? 'Entreprise' : ''
            }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectWorkLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun chantier disponible
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectWorkLogs.map(({ project, logs }) => (
                <ProjectReportCard
                  key={project.id}
                  project={project}
                  workLogs={logs}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
