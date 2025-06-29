
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/AppContext';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-helpers';
import { useLoadingStates } from '@/hooks/useLoadingStates';
import ModernScheduleHeader from './ModernScheduleHeader';
import ModernScheduleCalendar from './ModernScheduleCalendar';
import ModernScheduleList from './ModernScheduleList';
import ModernScheduleSidebar from './ModernScheduleSidebar';
import ScheduleTabs from '../ScheduleTabs';
import { useModernScheduleData } from './hooks/useModernScheduleData';

const ModernSchedule = () => {
  const { teams } = useApp();
  const { isLoading, setLoading } = useLoadingStates();
  const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['all']);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showWeekends, setShowWeekends] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('planning');

  const {
    filteredProjects,
    scheduledEvents,
    teamGroups,
    isLoading: dataLoading
  } = useModernScheduleData({
    selectedMonth,
    selectedYear,
    selectedTeams,
    showWeekends
  });

  const navigateMonth = async (direction: 'prev' | 'next') => {
    setLoading('navigation', true);
    
    try {
      let newMonth = selectedMonth;
      let newYear = selectedYear;
      
      if (direction === 'next') {
        if (selectedMonth === 12) {
          newMonth = 1;
          newYear = selectedYear + 1;
        } else {
          newMonth = selectedMonth + 1;
        }
      } else {
        if (selectedMonth === 1) {
          newMonth = 12;
          newYear = selectedYear - 1;
        } else {
          newMonth = selectedMonth - 1;
        }
      }
      
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    } finally {
      setTimeout(() => setLoading('navigation', false), 300);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(2024, i).toLocaleString('fr-FR', { month: 'long' })
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Loading skeleton for navigation
  if (isLoading('navigation')) {
    return (
      <div className="h-full flex flex-col space-y-6 animate-fade-in">
        <Skeleton className="h-20 w-full" />
        <div className="flex-1 flex gap-6">
          <Skeleton className="flex-1 h-96" />
          <Skeleton className="w-80 h-96" />
        </div>
      </div>
    );
  }

  // Si un onglet autre que planning est actif, afficher ScheduleTabs
  if (activeTab !== 'planning') {
    return (
      <div className="h-full flex flex-col space-y-6 animate-fade-in">
        <ScheduleTabs
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedTeam={selectedTeams[0] || 'all'}
          showWeekends={showWeekends}
          viewMode={viewMode}
          activeTab={activeTab}
          months={months}
          years={years}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onTeamChange={(team) => setSelectedTeams([team])}
          onShowWeekendsChange={setShowWeekends}
          onViewModeChange={setViewMode}
          onNavigateMonth={navigateMonth}
          onTabChange={setActiveTab}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <ModernScheduleHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedTeams={selectedTeams}
        viewMode={viewMode}
        showWeekends={showWeekends}
        teams={teams}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onTeamsChange={setSelectedTeams}
        onViewModeChange={setViewMode}
        onShowWeekendsChange={setShowWeekends}
        onNavigateMonth={navigateMonth}
      />

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 min-w-0">
          <Card className="h-full border-0 shadow-lg">
            {dataLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : viewMode === 'calendar' ? (
              <ModernScheduleCalendar
                month={selectedMonth}
                year={selectedYear}
                selectedTeams={selectedTeams}
                showWeekends={showWeekends}
                scheduledEvents={scheduledEvents}
                isLoading={dataLoading}
              />
            ) : (
              <ModernScheduleList
                selectedYear={selectedYear}
                selectedTeams={selectedTeams}
                teamGroups={teamGroups}
                isLoading={dataLoading}
              />
            )}
          </Card>
        </div>

        <ModernScheduleSidebar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedTeams={selectedTeams}
          filteredProjects={filteredProjects}
          scheduledEvents={scheduledEvents}
        />
      </div>
    </div>
  );
};

export default ModernSchedule;
