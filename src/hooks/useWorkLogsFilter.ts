
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { getCurrentYear, getCurrentMonth } from '@/utils/helpers';

export const useWorkLogsFilter = (workLogs: WorkLog[], projectInfos: any[]) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Get available years for the filter
  const getAvailableYears = () => {
    const years = workLogs.map(log => new Date(log.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Sort by descending order
  };
  
  const availableYears = getAvailableYears();
  
  // Filter work logs based on selected criteria
  const filteredLogs = workLogs.filter(log => {
    // Filter by project
    const matchesProject = selectedProjectId === 'all' || log.projectId === selectedProjectId;
    
    // Filter by team (via project)
    const matchesTeam = selectedTeamId === 'all' || 
      (projectInfos.find(p => p.id === log.projectId)?.team === selectedTeamId);
    
    // Filter by year
    const logDate = new Date(log.date);
    const matchesYear = logDate.getFullYear() === selectedYear;
    
    // Filter by month (if selected)
    const matchesMonth = selectedMonth === 'all' || 
      (typeof selectedMonth === 'number' && logDate.getMonth() === selectedMonth - 1);
    
    return matchesProject && matchesTeam && matchesYear && matchesMonth;
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
    availableYears,
    filteredLogs
  };
};
