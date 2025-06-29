
import React, { useState } from 'react';
import { useModernSidebarData } from './hooks/useModernSidebarData';
import { useScheduleNavigation } from './hooks/useScheduleNavigation';
import ModernSidebarStats from './components/ModernSidebarStats';
import ModernSidebarProjects from './components/ModernSidebarProjects';
import ModernSidebarActions from './components/ModernSidebarActions';
import ModernSidebarDialogs from './components/ModernSidebarDialogs';

interface ScheduledEvent {
  id: string;
  projectId: string;
  projectName: string;
  teams: string[];
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
}

interface ModernScheduleSidebarProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeams: string[];
  filteredProjects: any[];
  scheduledEvents: ScheduledEvent[];
}

const ModernScheduleSidebar: React.FC<ModernScheduleSidebarProps> = ({
  selectedMonth,
  selectedYear,
  selectedTeams,
  filteredProjects,
  scheduledEvents
}) => {
  const [showConstraintsDialog, setShowConstraintsDialog] = useState(false);
  const [showTeamsDialog, setShowTeamsDialog] = useState(false);
  
  const { monthStats, projectStats, monthName } = useModernSidebarData({
    selectedMonth,
    selectedYear,
    filteredProjects,
    scheduledEvents
  });

  const { navigateToDistribution, navigateToTeams, navigateToConstraints } = useScheduleNavigation();

  const handleConstraintsClick = () => {
    navigateToConstraints();
  };

  const handleDistributionClick = () => {
    navigateToDistribution();
  };

  const handleTeamsClick = () => {
    navigateToTeams();
  };

  return (
    <>
      <div className="w-80 space-y-4">
        <ModernSidebarStats
          monthName={monthName}
          year={selectedYear}
          monthStats={monthStats}
        />

        <ModernSidebarProjects
          projectStats={projectStats}
        />

        <ModernSidebarActions
          onConstraintsClick={handleConstraintsClick}
          onDistributionClick={handleDistributionClick}
          onTeamsClick={handleTeamsClick}
        />
      </div>

      <ModernSidebarDialogs
        showConstraintsDialog={showConstraintsDialog}
        showTeamsDialog={showTeamsDialog}
        onConstraintsDialogChange={setShowConstraintsDialog}
        onTeamsDialogChange={setShowTeamsDialog}
      />
    </>
  );
};

export default ModernScheduleSidebar;
