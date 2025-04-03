
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import WorkLogList from '@/components/worklogs/WorkLogList';
import { getCurrentYear, getCurrentMonth } from '@/utils/helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter } from 'lucide-react';
import { WorkLogsFilter } from '@/components/worklogs/WorkLogsFilter';
import { EmptyWorkLogState } from '@/components/worklogs/EmptyWorkLogState';
import { NoFilterResultsState } from '@/components/worklogs/NoFilterResultsState';
import { WorkLogFilterDescription } from '@/components/worklogs/WorkLogFilterDescription';

const WorkLogs = () => {
  const navigate = useNavigate();
  const { workLogs, projectInfos, teams } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Filtrer les logs en fonction de tous les critères sélectionnés
  const filteredLogs = workLogs.filter(log => {
    // Filtre par projet
    const matchesProject = selectedProjectId === 'all' || log.projectId === selectedProjectId;
    
    // Filtre par équipe (via le projet)
    const matchesTeam = selectedTeamId === 'all' || 
      (projectInfos.find(p => p.id === log.projectId)?.team === selectedTeamId);
    
    // Filtre par année
    const logDate = new Date(log.date);
    const matchesYear = logDate.getFullYear() === selectedYear;
    
    // Filtre par mois (si sélectionné)
    const matchesMonth = selectedMonth === 'all' || 
      logDate.getMonth() === (typeof selectedMonth === 'number' ? selectedMonth - 1 : 0);
    
    return matchesProject && matchesTeam && matchesYear && matchesMonth;
  });
  
  // Get project name for the filter description
  const selectedProjectName = projectInfos.find(p => p.id === selectedProjectId)?.name;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Suivi des travaux</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches de suivi de chantier
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/worklogs/new')}
          disabled={projectInfos.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche
        </Button>
      </div>
      
      <WorkLogsFilter 
        projects={projectInfos}
        teams={teams}
        selectedProjectId={selectedProjectId}
        selectedTeamId={selectedTeamId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onProjectChange={setSelectedProjectId}
        onTeamChange={setSelectedTeamId}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Fiches de suivi</CardTitle>
          <CardDescription>
            <WorkLogFilterDescription 
              selectedProjectId={selectedProjectId}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              projectName={selectedProjectName}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workLogs.length === 0 ? (
            <EmptyWorkLogState hasProjects={projectInfos.length > 0} />
          ) : filteredLogs.length === 0 ? (
            <NoFilterResultsState />
          ) : (
            <WorkLogList workLogs={filteredLogs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkLogs;
