
import { useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { getCurrentYear } from '@/utils/date-helpers';

export const useWorkLogsFiltering = (workLogs: WorkLog[]) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // Get current week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  };
  
  const currentWeek = getWeekNumber(new Date());
  
  // Filter logs based on selected criteria
  const filteredLogs = workLogs.filter(log => {
    // First, exclude blank worksheets from regular work logs
    if (log.isBlankWorksheet === true) {
      return false;
    }
    
    const logDate = new Date(log.date);
    const matchesProject = selectedProjectId === 'all' || log.projectId === selectedProjectId;
    const matchesYear = logDate.getFullYear() === selectedYear;
    const matchesMonth = selectedMonth === 'all' || logDate.getMonth() === (typeof selectedMonth === 'number' ? selectedMonth - 1 : 0);
    const matchesWeek = timeFilter !== 'week' || getWeekNumber(logDate) === currentWeek;
    const matchesDay = timeFilter !== 'today' || (
      logDate.getDate() === new Date().getDate() && 
      logDate.getMonth() === new Date().getMonth() && 
      logDate.getFullYear() === new Date().getFullYear()
    );
    
    return matchesProject && matchesYear && matchesMonth && matchesWeek && matchesDay;
  });

  return {
    selectedProjectId,
    setSelectedProjectId,
    selectedTeamId,
    setSelectedTeamId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeFilter,
    setTimeFilter,
    filteredLogs
  };
};
