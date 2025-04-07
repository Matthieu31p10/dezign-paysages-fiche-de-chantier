
import { WorkLog } from '@/types/models';
import { formatMonthYear } from '@/utils/helpers';
import WorkLogItem from './WorkLogItem';

interface WorkLogMonthGroupProps {
  month: string;
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogMonthGroup = ({ month, workLogs, projectId }: WorkLogMonthGroupProps) => {
  // Format le mois et l'année pour l'affichage (ex: "Janvier 2023")
  const formattedMonth = formatMonthYear(month);
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{formattedMonth}</h3>
      <div className="space-y-3">
        {workLogs.map((workLog) => (
          <WorkLogItem 
            key={workLog.id} 
            workLog={workLog} 
            projectId={projectId} 
          />
        ))}
      </div>
    </div>
  );
};

export default WorkLogMonthGroup;
