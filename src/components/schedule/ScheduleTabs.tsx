
import React, { useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import ScheduleCalendar from './ScheduleCalendar';
import ProjectScheduleList from './ProjectScheduleList';
import MonthlyDistribution from './MonthlyDistribution';
import TeamSchedules from './TeamSchedules';
import ConfigurationTabs from './configuration/ConfigurationTabs';
import LastVisitsOverview from './last-visits/LastVisitsOverview';
import PassagesList from './passages/PassagesList';
import TabsHeader from './tabs/TabsHeader';
import PlanningControls from './tabs/PlanningControls';
import DateNavigation from './tabs/DateNavigation';

interface ScheduleTabsProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeam: string;
  showWeekends: boolean;
  viewMode: 'calendar' | 'list';
  activeTab: string;
  months: Array<{ value: string; label: string }>;
  years: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onTeamChange: (team: string) => void;
  onShowWeekendsChange: (show: boolean) => void;
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onTabChange: (tab: string) => void;
}

const ScheduleTabs: React.FC<ScheduleTabsProps> = ({
  selectedMonth,
  selectedYear,
  selectedTeam,
  showWeekends,
  viewMode,
  activeTab,
  months,
  years,
  onMonthChange,
  onYearChange,
  onTeamChange,
  onShowWeekendsChange,
  onViewModeChange,
  onNavigateMonth,
  onTabChange,
}) => {
  const { teams, projectInfos } = useApp();
  const activeProjects = projectInfos.filter(p => !p.isArchived);

  // Écouter les événements de navigation depuis la sidebar moderne
  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      const { tab } = event.detail;
      onTabChange(tab);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);

    return () => {
      window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    };
  }, [onTabChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TabsHeader />

            {activeTab === 'planning' && (
              <PlanningControls
                projects={activeProjects}
                viewMode={viewMode}
                showWeekends={showWeekends}
                onViewModeChange={onViewModeChange}
                onShowWeekendsChange={onShowWeekendsChange}
              />
            )}
          </div>

          {(activeTab === 'planning' || activeTab === 'distribution' || activeTab === 'teams') && (
            <DateNavigation
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              selectedTeam={selectedTeam}
              months={months}
              years={years}
              teams={teams}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
              onTeamChange={onTeamChange}
              onNavigateMonth={onNavigateMonth}
            />
          )}
        </div>

        <div className="p-6">
          <TabsContent value="planning" className="mt-0">
            {viewMode === 'calendar' ? (
              <ScheduleCalendar
                month={selectedMonth}
                year={selectedYear}
                teamId={selectedTeam}
                showWeekends={showWeekends}
              />
            ) : (
              <ProjectScheduleList
                selectedYear={selectedYear}
                selectedTeam={selectedTeam}
              />
            )}
          </TabsContent>

          <TabsContent value="passages" className="mt-0">
            <PassagesList
              selectedTeams={selectedTeam === 'all' ? ['all'] : [selectedTeam]}
              showWeekends={showWeekends}
            />
          </TabsContent>

          <TabsContent value="distribution" className="mt-0">
            <MonthlyDistribution
              projects={projectInfos}
              teams={teams}
            />
          </TabsContent>

          <TabsContent value="teams" className="mt-0">
            <TeamSchedules
              month={selectedMonth}
              year={selectedYear}
              teamId={selectedTeam}
              teams={teams}
              projects={projectInfos}
            />
          </TabsContent>

          <TabsContent value="last-visits" className="mt-0">
            <LastVisitsOverview
              selectedTeam={selectedTeam}
            />
          </TabsContent>

          <TabsContent value="configuration" className="mt-0">
            <ConfigurationTabs
              projectInfos={projectInfos}
              rules={[]}
              selectedProject=""
              currentRule={{}}
              onProjectChange={() => {}}
              onRuleChange={() => {}}
              onSaveRule={() => {}}
              onTogglePreferredDay={() => {}}
              onTogglePreferredTime={() => {}}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ScheduleTabs;
