import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysIcon, Users, List, Clock } from 'lucide-react';
import ScheduleCalendar from './ScheduleCalendar';
import TeamSchedules from './TeamSchedules';
import MonthlyDistribution from './MonthlyDistribution';
import ProjectScheduleList from './ProjectScheduleList';
import LastVisitsOverview from './last-visits/LastVisitsOverview';
import ScheduleControls from './ScheduleControls';
import { useApp } from '@/context/AppContext';

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
          <TabsTrigger value="previsions" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Prévisions</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Distribution</span>
          </TabsTrigger>
          <TabsTrigger value="derniers-passages" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Derniers passages</span>
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
      
      <TabsContent value="previsions" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <select 
              value={selectedYear} 
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="h-8 px-3 bg-white border border-gray-300 rounded-md text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedTeam} 
              onChange={(e) => onTeamChange(e.target.value)}
              className="h-8 px-3 bg-white border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Toutes les équipes</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <ProjectScheduleList 
          selectedYear={selectedYear}
          selectedTeam={selectedTeam}
        />
      </TabsContent>
      
      <TabsContent value="distribution" className="space-y-4">
        <MonthlyDistribution 
          projects={projectInfos} 
          teams={teams}
        />
      </TabsContent>
      
      <TabsContent value="derniers-passages" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Suivi des derniers passages</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedTeam} 
              onChange={(e) => onTeamChange(e.target.value)}
              className="h-8 px-3 bg-white border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Toutes les équipes</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <LastVisitsOverview selectedTeam={selectedTeam} />
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleTabs;
