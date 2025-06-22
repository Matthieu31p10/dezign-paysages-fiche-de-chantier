import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ScheduleCalendar from './ScheduleCalendar';
import ProjectScheduleList from './ProjectScheduleList';
import MonthlyDistribution from './MonthlyDistribution';
import TeamSchedules from './TeamSchedules';
import ConfigurationTabs from './configuration/ConfigurationTabs';
import LastVisitsOverview from './last-visits/LastVisitsOverview';
import ProjectLocksManager from './project-locks/components/ProjectLocksManager';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-6 gap-1">
              <TabsTrigger value="planning" className="text-sm">Planning</TabsTrigger>
              <TabsTrigger value="distribution" className="text-sm">Répartition</TabsTrigger>
              <TabsTrigger value="teams" className="text-sm">Équipes</TabsTrigger>
              <TabsTrigger value="last-visits" className="text-sm">Derniers passages</TabsTrigger>
              <TabsTrigger value="configuration" className="text-sm">Configuration</TabsTrigger>
            </TabsList>

            {activeTab === 'planning' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <ProjectLocksManager projects={activeProjects} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewModeChange(viewMode === 'calendar' ? 'list' : 'calendar')}
                    className="flex items-center gap-2"
                  >
                    {viewMode === 'calendar' ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    {viewMode === 'calendar' ? 'Vue liste' : 'Vue calendrier'}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="show-weekends"
                    checked={showWeekends}
                    onCheckedChange={onShowWeekendsChange}
                  />
                  <Label htmlFor="show-weekends" className="text-sm">Week-ends</Label>
                </div>
              </div>
            )}
          </div>

          {(activeTab === 'planning' || activeTab === 'distribution' || activeTab === 'teams') && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateMonth('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateMonth('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="team-select" className="text-sm font-medium">Équipe:</Label>
                <Select value={selectedTeam} onValueChange={onTeamChange}>
                  <SelectTrigger className="w-40" id="team-select">
                    <SelectValue placeholder="Sélectionner" />
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
            </div>
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
