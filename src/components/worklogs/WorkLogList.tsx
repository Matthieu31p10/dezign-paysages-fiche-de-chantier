
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { getCurrentYear } from '@/utils/helpers';
import { WorkLogListHeader } from './WorkLogListHeader';
import { WorkLogMonthGroup } from './WorkLogMonthGroup';
import { WorkLogListEmpty } from './WorkLogListEmpty';
import { WorkLogNoResults } from './WorkLogNoResults';
import { 
  groupWorkLogsByMonth, 
  getYearsFromWorkLogs, 
  filterWorkLogsByYear 
} from '@/utils/helpers';

interface WorkLogListProps {
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogList = ({ workLogs, projectId }: WorkLogListProps) => {
  const { deleteWorkLog, getProjectById } = useApp();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOption, setSortOption] = useState<string>('date-desc');
  
  // Get available years from the work logs
  const availableYears = getYearsFromWorkLogs(workLogs);
  
  // If no workLogs, show empty state
  if (workLogs.length === 0) {
    return <WorkLogListEmpty projectId={projectId} />;
  }
  
  // Filter work logs for the selected year
  const yearFilteredLogs = selectedYear 
    ? filterWorkLogsByYear(workLogs, selectedYear) 
    : workLogs;
  
  // Filter logs by search term
  const filteredLogs = yearFilteredLogs.filter(log => {
    if (!search.trim()) return true;
    
    const project = getProjectById(log.projectId);
    const searchLower = search.toLowerCase();
    
    return (
      project?.name.toLowerCase().includes(searchLower) ||
      formatDate(log.date).includes(searchLower) ||
      log.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });
  
  // If no results after filtering, show no results component
  if (filteredLogs.length === 0) {
    return (
      <WorkLogNoResults 
        search={search}
        setSearch={setSearch}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
      />
    );
  }
  
  // Sort logs based on the selected option
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch(sortOption) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'project-asc':
        const projectA = getProjectById(a.projectId)?.name || '';
        const projectB = getProjectById(b.projectId)?.name || '';
        return projectA.localeCompare(projectB);
      case 'project-desc':
        const projectNameA = getProjectById(a.projectId)?.name || '';
        const projectNameB = getProjectById(b.projectId)?.name || '';
        return projectNameB.localeCompare(projectNameA);
      case 'hours-asc':
        return a.timeTracking.totalHours - b.timeTracking.totalHours;
      case 'hours-desc':
        return b.timeTracking.totalHours - a.timeTracking.totalHours;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  // Group logs by month (after sorting)
  const groupedLogs = groupWorkLogsByMonth(sortedLogs);
  
  // Sort months in the correct order based on the sort option
  const sortedMonths = Object.keys(groupedLogs).sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    
    if (sortOption.includes('asc')) {
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    } else {
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    }
  });
  
  const handleDeleteWorkLog = (id: string) => {
    deleteWorkLog(id);
  };
  
  return (
    <div className="space-y-4">
      <WorkLogListHeader
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
            logs={groupedLogs[month]}
            projectId={projectId}
            onDeleteWorkLog={handleDeleteWorkLog}
            getProjectById={getProjectById}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkLogList;

// Fix missing import
import { formatDate } from '@/utils/helpers';
