
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { getCurrentYear, getCurrentMonth } from '@/utils/helpers';
import { Toaster } from '@/components/ui/sonner';
import WorkLogsHeader from '@/components/work-logs/WorkLogsHeader';
import WorkLogsFilters from '@/components/work-logs/WorkLogsFilters';
import WorkLogsContent from '@/components/work-logs/WorkLogsContent';
import { useWorkLogsFilter } from '@/hooks/useWorkLogsFilter';

const WorkLogs = () => {
  const navigate = useNavigate();
  const { workLogs, projectInfos, teams } = useApp();
  
  const {
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
  } = useWorkLogsFilter(workLogs, projectInfos);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WorkLogsHeader hasProjects={projectInfos.length > 0} />
      
      <WorkLogsFilters 
        projectInfos={projectInfos}
        teams={teams}
        availableYears={availableYears}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        getCurrentYear={getCurrentYear}
      />
      
      <WorkLogsContent 
        workLogs={workLogs}
        filteredLogs={filteredLogs}
        projectInfos={projectInfos}
        selectedProjectId={selectedProjectId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      
      <Toaster />
    </div>
  );
};

export default WorkLogs;
