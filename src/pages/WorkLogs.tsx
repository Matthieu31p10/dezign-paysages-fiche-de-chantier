
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkLogList from '@/components/worklogs/WorkLogList';
import WorkLogsHeader from '@/components/worklogs/list/WorkLogsHeader';
import TimeFilterTabs from '@/components/worklogs/list/TimeFilterTabs';
import { WorkLogDashboard } from '@/components/worklogs/dashboard/WorkLogDashboard';
import { WorkLogAnalytics } from '@/components/worklogs/analytics/WorkLogAnalytics';
import { WorkLogAdvancedFilters } from '@/components/worklogs/filters/WorkLogAdvancedFilters';
import { WorkLogCalendarView } from '@/components/worklogs/calendar/WorkLogCalendarView';
import { useAdvancedWorkLogsFiltering } from '@/components/worklogs/hooks/useAdvancedWorkLogsFiltering';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WorkLogs = () => {
  const { projectInfos, teams } = useApp();
  const { workLogs } = useWorkLogs();
  const {
    selectedProjectId,
    setSelectedProjectId,
    selectedTeamId,
    setSelectedTeamId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeFilter,
    setTimeFilter,
    advancedFilters,
    setAdvancedFilters,
    savedFilters,
    saveFilter,
    loadFilter,
    deleteFilter,
    filteredLogs
  } = useAdvancedWorkLogsFiltering(workLogs);

  // Fonction pour obtenir le nom d'un projet
  const getProjectName = (projectId: string) => {
    const project = projectInfos.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WorkLogsHeader projectInfos={projectInfos} />
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="list">Liste des fiches</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-6">
          <WorkLogAnalytics workLogs={workLogs} teams={teams} />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-6">
          <WorkLogAdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            teams={teams}
            projects={projectInfos}
            savedFilters={savedFilters}
            onSaveFilter={saveFilter}
            onLoadFilter={loadFilter}
            onDeleteFilter={deleteFilter}
          />
          <WorkLogCalendarView
            workLogs={filteredLogs}
            getProjectName={getProjectName}
          />
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-6">
          <WorkLogDashboard workLogs={workLogs} teams={teams} />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-6">
          <WorkLogAdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            teams={teams}
            projects={projectInfos}
            savedFilters={savedFilters}
            onSaveFilter={saveFilter}
            onLoadFilter={loadFilter}
            onDeleteFilter={deleteFilter}
          />
          
          <TimeFilterTabs 
            value={timeFilter} 
            onChange={setTimeFilter} 
          />
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-64">
              <label className="text-sm font-medium block mb-2">Filtrer par chantier</label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger className="bg-white border-green-200">
                  <SelectValue placeholder="Tous les chantiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les chantiers</SelectItem>
                  {projectInfos.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-64">
              <label className="text-sm font-medium block mb-2">Filtrer par équipe</label>
              <Select
                value={selectedTeamId}
                onValueChange={setSelectedTeamId}
              >
                <SelectTrigger className="bg-white border-green-200">
                  <SelectValue placeholder="Toutes les équipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-64">
              <label className="text-sm font-medium block mb-2">Mois</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(value === 'all' ? 'all' : Number(value))}
              >
                <SelectTrigger className="bg-white border-green-200">
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  <SelectItem value="1">Janvier</SelectItem>
                  <SelectItem value="2">Février</SelectItem>
                  <SelectItem value="3">Mars</SelectItem>
                  <SelectItem value="4">Avril</SelectItem>
                  <SelectItem value="5">Mai</SelectItem>
                  <SelectItem value="6">Juin</SelectItem>
                  <SelectItem value="7">Juillet</SelectItem>
                  <SelectItem value="8">Août</SelectItem>
                  <SelectItem value="9">Septembre</SelectItem>
                  <SelectItem value="10">Octobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Décembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="border-green-200 shadow-md overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-white">
              <CardTitle className="flex items-center">
                <span>Fiches de suivi</span>
                <span className="ml-2 bg-green-100 text-green-800 text-sm rounded-full px-2 py-0.5">
                  {filteredLogs.length}
                </span>
              </CardTitle>
              <CardDescription>
                {selectedProjectId === 'all'
                  ? 'Toutes les fiches de suivi'
                  : `Fiches de suivi pour ${projectInfos.find(p => p.id === selectedProjectId)?.name || 'ce chantier'}`
                }
                {selectedTeamId !== 'all' && ` - Équipe ${teams.find(t => t.id === selectedTeamId)?.name}`}
                {selectedMonth !== 'all' && ` - ${new Date(0, Number(selectedMonth) - 1).toLocaleString('fr-FR', { month: 'long' })}`}
                {` - ${selectedYear}`}
                {timeFilter === 'today' && ' - Aujourd\'hui'}
                {timeFilter === 'week' && ' - Cette semaine'}
                {advancedFilters.searchQuery && ` - Recherche: "${advancedFilters.searchQuery}"`}
                {advancedFilters.invoiceStatus !== 'all' && ` - ${advancedFilters.invoiceStatus === 'invoiced' ? 'Facturées' : 'Non facturées'}`}
                {advancedFilters.selectedTeams.length > 0 && ` - ${advancedFilters.selectedTeams.length} équipe(s) sélectionnée(s)`}
                {advancedFilters.selectedProjects.length > 0 && ` - ${advancedFilters.selectedProjects.length} projet(s) sélectionné(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkLogList workLogs={filteredLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkLogs;
