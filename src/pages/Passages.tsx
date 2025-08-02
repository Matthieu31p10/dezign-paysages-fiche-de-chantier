import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PassageFilters } from '@/components/passages/PassageFilters';
import { PassageStats } from '@/components/passages/PassageStats';
import { PassageViewTabs } from '@/components/passages/PassageViewTabs';
import { useProjectPassageHistory } from '@/hooks/useProjectPassageHistory';

const Passages = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const { activeProjects, activeTeams, sortedPassages, stats, getProjectName } = useProjectPassageHistory({
    workLogs,
    projectInfos,
    teams,
    selectedProject,
    selectedTeam,
    searchQuery,
    periodFilter
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Passages</h1>
        <p className="text-muted-foreground">
          Visualisez les passages effectués et leur fréquence
        </p>
      </div>

      <PassageFilters
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        activeProjects={activeProjects}
        activeTeams={activeTeams}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        totalPassages={workLogs.length}
        filteredCount={sortedPassages.length}
      />

      <PassageStats
        totalPassages={stats.totalPassages}
        lastPassageDate={stats.lastPassageDate}
        daysSinceLastPassage={stats.daysSinceLastPassage}
      />

      <PassageViewTabs
        workLogs={workLogs}
        projectInfos={projectInfos}
        teams={teams}
        sortedPassages={sortedPassages}
        selectedProject={selectedProject}
        selectedTeam={selectedTeam}
        getProjectName={getProjectName}
      />
    </div>
  );
};

export default Passages;