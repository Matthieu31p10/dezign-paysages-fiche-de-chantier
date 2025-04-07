
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { groupWorkLogsByMonth, getCurrentYear, getYearsFromWorkLogs, filterWorkLogsByYear, formatDate } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';
import EmptyState from './list/EmptyState';
import NoResultsState from './list/NoResultsState';
import WorkLogFilters from './list/WorkLogFilters';
import WorkLogMonthGroup from './list/WorkLogMonthGroup';
import { sortWorkLogs, sortMonths } from './list/utils';

interface WorkLogListProps {
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogList = ({ workLogs, projectId }: WorkLogListProps) => {
  const navigate = useNavigate();
  const { getProjectById } = useApp();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOption, setSortOption] = useState<string>('date-desc');
  
  // If there are no work logs at all
  if (workLogs.length === 0) {
    return (
      <EmptyState 
        message="Aucune fiche de suivi disponible" 
        projectId={projectId} 
      />
    );
  }
  
  // Filter work logs for the selected year
  const yearFilteredLogs = selectedYear 
    ? filterWorkLogsByYear(workLogs, selectedYear) 
    : workLogs;
  
  // Get available years from the work logs
  const availableYears = getYearsFromWorkLogs(workLogs);
  
  // Filter logs by search term
  const filteredLogs = yearFilteredLogs.filter(log => {
    if (!search.trim()) return true;
    
    const project = getProjectById(log.projectId);
    const searchLower = search.toLowerCase();
    
    return (
      project?.name?.toLowerCase().includes(searchLower) ||
      formatDate(new Date(log.date)).includes(searchLower) ||
      log.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });
  
  // If filtered logs are empty, show no results
  if (filteredLogs.length === 0) {
    return (
      <NoResultsState
        search={search}
        setSearch={setSearch}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
      />
    );
  }
  
  // Sort logs based on the selected option
  const sortedLogs = sortWorkLogs(filteredLogs, sortOption, getProjectById);
  
  // Group logs by month (after sorting)
  const groupedLogs = groupWorkLogsByMonth(sortedLogs);
  
  // Sort months in the correct order based on the sort option
  const sortedMonths = sortMonths(Object.keys(groupedLogs), sortOption);
  
  return (
    <div className="space-y-4">
      <WorkLogFilters
        search={search}
        setSearch={setSearch}
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
      />
      
      <div className="space-y-6">
        {sortedMonths.map(month => (
          <WorkLogMonthGroup
            key={month}
            month={month}
            workLogs={groupedLogs[month]}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkLogList;
