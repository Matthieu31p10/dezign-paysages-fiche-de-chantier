
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModernSidebarData } from './hooks/useModernSidebarData';
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
  const navigate = useNavigate();
  const [showConstraintsDialog, setShowConstraintsDialog] = useState(false);
  const [showTeamsDialog, setShowTeamsDialog] = useState(false);
  
  const { monthStats, projectStats, monthName } = useModernSidebarData({
    selectedMonth,
    selectedYear,
    filteredProjects,
    scheduledEvents
  });

  const handleConstraintsClick = () => {
    setShowConstraintsDialog(true);
  };

  const handleDistributionClick = () => {
    navigate('/schedule');
  };

  const handleTeamsClick = () => {
    setShowTeamsDialog(true);
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
