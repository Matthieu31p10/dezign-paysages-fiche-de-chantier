
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysIcon, Settings, Clock, Users } from 'lucide-react';
import ScheduleCalendar from './ScheduleCalendar';
import TeamSchedules from './TeamSchedules';
import SchedulingRules from './SchedulingRules';
import MonthlyDistribution from './MonthlyDistribution';
import SchedulingConfiguration from './SchedulingConfiguration';
import ScheduleControls from './ScheduleControls';
import { useApp } from '@/context/AppContext';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-helpers';

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
  const { projectInfos, teams } = useApp();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:flex">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Planning</span>
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Consignes</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Règles</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Distribution</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="planning" className="space-y-4">
        <ScheduleControls
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedTeam={selectedTeam}
          showWeekends={showWeekends}
          viewMode={viewMode}
          teams={teams}
          months={months}
          years={years}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          onTeamChange={onTeamChange}
          onShowWeekendsChange={onShowWeekendsChange}
          onViewModeChange={onViewModeChange}
          onNavigateMonth={onNavigateMonth}
        />
        
        <div className="transition-all duration-300">
          {viewMode === 'calendar' ? (
            <ScheduleCalendar 
              month={selectedMonth} 
              year={selectedYear} 
              teamId={selectedTeam}
              showWeekends={showWeekends}
            />
          ) : (
            <TeamSchedules
              month={selectedMonth}
              year={selectedYear}
              teamId={selectedTeam}
              teams={teams}
              projects={projectInfos}
            />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="configuration" className="space-y-4">
        <SchedulingConfiguration />
      </TabsContent>
      
      <TabsContent value="rules" className="space-y-4">
        <SchedulingRules projects={projectInfos} teams={teams} />
      </TabsContent>
      
      <TabsContent value="distribution" className="space-y-4">
        <MonthlyDistribution 
          projects={projectInfos} 
          teams={teams}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleTabs;
