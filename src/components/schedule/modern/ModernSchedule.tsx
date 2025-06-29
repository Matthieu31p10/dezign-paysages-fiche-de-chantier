
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-helpers';
import ModernScheduleHeader from './ModernScheduleHeader';
import ModernScheduleCalendar from './ModernScheduleCalendar';
import ModernScheduleList from './ModernScheduleList';
import ModernScheduleSidebar from './ModernScheduleSidebar';
import ScheduleTabs from '../ScheduleTabs';
import { useModernScheduleData } from './hooks/useModernScheduleData';

const ModernSchedule = () => {
  const { teams } = useApp();
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
    isLoading
  } = useModernScheduleData({
    selectedMonth,
    selectedYear,
    selectedTeams,
    showWeekends
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
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
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(2024, i).toLocaleString('fr-FR', { month: 'long' })
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
            {viewMode === 'calendar' ? (
              <ModernScheduleCalendar
                month={selectedMonth}
                year={selectedYear}
                selectedTeams={selectedTeams}
                showWeekends={showWeekends}
                scheduledEvents={scheduledEvents}
                isLoading={isLoading}
              />
            ) : (
              <ModernScheduleList
                selectedYear={selectedYear}
                selectedTeams={selectedTeams}
                teamGroups={teamGroups}
                isLoading={isLoading}
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
