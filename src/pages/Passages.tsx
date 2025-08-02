import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MobilePassageFilters } from '@/components/passages/MobilePassageFilters';
import { AdvancedPassageStats } from '@/components/passages/AdvancedPassageStats';
import { PassageCharts } from '@/components/passages/PassageCharts';
import { AdvancedPassageFeatures } from '@/components/passages/AdvancedPassageFeatures';
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
    <div className="space-y-4 md:space-y-6 animate-fade-in p-4 md:p-0">
      <div className="text-center py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Passages</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visualisez les passages effectués et leur fréquence
        </p>
      </div>

      <MobilePassageFilters
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

      <AdvancedPassageStats
        totalPassages={stats.totalPassages}
        lastPassageDate={stats.lastPassageDate}
        daysSinceLastPassage={stats.daysSinceLastPassage}
        passages={sortedPassages}
        getProjectName={getProjectName}
      />

      {/* Fonctionnalités avancées */}
      <AdvancedPassageFeatures
        passages={sortedPassages}
        getProjectName={getProjectName}
        onProjectSelect={setSelectedProject}
        currentFilters={{
          selectedProject,
          selectedTeam,
          searchQuery,
          periodFilter
        }}
      />

      {/* Graphiques - masqués sur mobile pour économiser l'espace */}
      <div className="hidden md:block">
        <PassageCharts
          passages={sortedPassages}
          getProjectName={getProjectName}
        />
      </div>

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