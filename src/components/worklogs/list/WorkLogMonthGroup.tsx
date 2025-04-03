
import { WorkLog } from '@/types/models';
import { formatMonthYear } from '@/utils/helpers';
import WorkLogItem from './WorkLogItem';

interface WorkLogMonthGroupProps {
  month: string;
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogMonthGroup = ({ month, workLogs, projectId }: WorkLogMonthGroupProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {formatMonthYear(month)}
      </h3>
      
      <div className="space-y-2">
        {workLogs.map((log, index) => (
          <WorkLogItem 
            key={log.id} 
            workLog={log} 
            index={index} 
            projectId={projectId} 
          />
        ))}
      </div>
    </div>
  );
};

export default WorkLogMonthGroup;
