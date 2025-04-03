
import { WorkLog } from '@/types/models';
import { formatMonthYear } from '@/utils/helpers';
import { WorkLogListItem } from './WorkLogListItem';

interface WorkLogMonthGroupProps {
  month: string;
  logs: WorkLog[];
  projectId?: string;
  onDeleteWorkLog: (id: string) => void;
  getProjectById: (id: string) => any;
}

export const WorkLogMonthGroup = ({ 
  month, 
  logs, 
  projectId,
  onDeleteWorkLog,
  getProjectById
}: WorkLogMonthGroupProps) => {
  return (
    <div key={month} className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {formatMonthYear(month)}
      </h3>
      
      <div className="space-y-2">
        {logs.map((log, index) => (
          <WorkLogListItem
            key={log.id}
            log={log}
            index={index}
            projectId={projectId}
            onDelete={onDeleteWorkLog}
            getProjectById={getProjectById}
          />
        ))}
      </div>
    </div>
  );
};
