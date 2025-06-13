import React from 'react';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useProjects } from '@/context/ProjectsContext';
import GlobalStats from './GlobalStats';
import YearlyAnalysisTab from './YearlyAnalysisTab';

const StatsTab: React.FC = () => {
  const { workLogs } = useWorkLogs();
  const { projectInfos } = useProjects();

  return (
    <div className="space-y-6">
      <GlobalStats workLogs={workLogs} projectInfos={projectInfos} />
      <YearlyAnalysisTab workLogs={workLogs} />
    </div>
  );
};

export default StatsTab;
