
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
import { WorkLogFinancialManagement } from '@/components/worklogs/financial/WorkLogFinancialManagement';
import { WorkLogExportManager } from '@/components/worklogs/export/WorkLogExportManager';
import { WorkLogNotifications } from '@/components/worklogs/notifications/WorkLogNotifications';
import { WorkLogAutomation } from '@/components/worklogs/automation/WorkLogAutomation';
import { useAdvancedWorkLogsFiltering } from '@/components/worklogs/hooks/useAdvancedWorkLogsFiltering';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkLog } from '@/types/models';

const WorkLogs = () => {
  const { projectInfos, teams } = useApp();
  const { workLogs } = useWorkLogs();

  // Séparer les fiches de suivi des fiches vierges
  const isBlankWorksheet = (log: WorkLog) => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'));
  
  const workLogsSuivi = workLogs.filter(log => !isBlankWorksheet(log));

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
  } = useAdvancedWorkLogsFiltering(workLogsSuivi);

  // Fonction pour obtenir le nom d'un projet
  const getProjectName = (projectId: string) => {
    const project = projectInfos.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WorkLogsHeader projectInfos={projectInfos} />
      
      <Tabs defaultValue="suivi" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suivi">Fiches Suivi</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-6">
          <WorkLogAnalytics workLogs={workLogsSuivi} teams={teams} />
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
        
        <TabsContent value="export" className="space-y-6">
          <WorkLogExportManager workLogs={workLogsSuivi} />
        </TabsContent>

        <TabsContent value="suivi" className="space-y-6">
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
                <SelectTrigger className="bg-white border-blue-200">
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
                <SelectTrigger className="bg-white border-blue-200">
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
                <SelectTrigger className="bg-white border-blue-200">
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
          
          <Card className="border-blue-200 shadow-md overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center">
                <span>Fiches de suivi</span>
                <span className="ml-2 bg-blue-100 text-blue-800 text-sm rounded-full px-2 py-0.5">
                  {filteredLogs.length}
                </span>
              </CardTitle>
              <CardDescription>
                Fiches de suivi des projets contractuels
                {selectedProjectId !== 'all' && ` - ${projectInfos.find(p => p.id === selectedProjectId)?.name}`}
                {selectedTeamId !== 'all' && ` - Équipe ${teams.find(t => t.id === selectedTeamId)?.name}`}
                {selectedMonth !== 'all' && ` - ${new Date(0, Number(selectedMonth) - 1).toLocaleString('fr-FR', { month: 'long' })}`}
                {` - ${selectedYear}`}
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
