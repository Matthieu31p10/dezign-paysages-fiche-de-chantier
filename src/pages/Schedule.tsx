
import React, { useState, useMemo } from 'react';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ScheduleTabs from '@/components/schedule/ScheduleTabs';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-helpers';

const Schedule = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeTab, setActiveTab] = useState<string>('planning');
  const [showWeekends, setShowWeekends] = useState<boolean>(true);
  
  const months = useMemo(() => [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" }
  ], []);

  const years = useMemo(() => {
    const currentYear = getCurrentYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);
  }, []);

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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ScheduleHeader />
      
      <ScheduleTabs
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedTeam={selectedTeam}
        showWeekends={showWeekends}
        viewMode={viewMode}
        activeTab={activeTab}
        months={months}
        years={years}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onTeamChange={setSelectedTeam}
        onShowWeekendsChange={setShowWeekends}
        onViewModeChange={setViewMode}
        onNavigateMonth={navigateMonth}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Schedule;
