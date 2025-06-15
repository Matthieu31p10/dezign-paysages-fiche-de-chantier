
import React from 'react';
import { WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';
import WorkLogItem from './list/WorkLogItem';
import EmptyState from './list/EmptyState';

interface WorkLogListProps {
  workLogs: WorkLog[];
}

const WorkLogList: React.FC<WorkLogListProps> = ({ workLogs }) => {
  const { getProjectById } = useApp();
  
  if (workLogs.length === 0) {
    return <EmptyState message="Aucune fiche de suivi trouvée" />;
  }
  
  return (
    <div className="space-y-3">
      {workLogs.map((workLog) => {
        const project = workLog.projectId ? getProjectById(workLog.projectId) : undefined;
        
        return (
          <WorkLogItem 
            key={workLog.id} 
            workLog={workLog}
            project={project}
          />
        );
      })}
    </div>
  );
};

export default WorkLogList;
