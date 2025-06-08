
import React from 'react';
import { WorkLog } from '@/types/models';
import { formatMonthYear } from '@/utils/format-utils';
import WorkLogItem from './WorkLogItem';

interface WorkLogMonthGroupProps {
  month: string;
  workLogs: WorkLog[];
  projectId?: string;
  isMobile?: boolean;
}

const WorkLogMonthGroup: React.FC<WorkLogMonthGroupProps> = ({ month, workLogs, projectId, isMobile }) => {
  // Format le mois et l'année pour l'affichage (ex: "Janvier 2023")
  // Convert string to Date before passing to formatMonthYear
  const formattedMonth = month; // We'll use the month string directly since it's already formatted
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{formattedMonth}</h3>
      <div className="space-y-3">
        {workLogs.map((workLog) => (
          <WorkLogItem 
            key={workLog.id} 
            workLog={workLog}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkLogMonthGroup;
