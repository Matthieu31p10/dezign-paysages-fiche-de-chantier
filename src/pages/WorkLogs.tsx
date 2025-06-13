
import React from 'react';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import WorkLogList from '@/components/worklogs/WorkLogList';

const WorkLogs: React.FC = () => {
  const { workLogs, isLoading } = useWorkLogs();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkLogList workLogs={workLogs} />
    </div>
  );
};

export default WorkLogs;
