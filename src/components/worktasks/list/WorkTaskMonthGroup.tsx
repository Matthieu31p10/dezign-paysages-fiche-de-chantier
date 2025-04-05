
import React from 'react';
import { WorkTask } from '@/types/models';
import { WorkTaskItem } from './WorkTaskItem';
import { formatDateMonthYear } from '@/utils/format';
import { Badge } from '@/components/ui/badge';

interface WorkTaskMonthGroupProps {
  monthKey: string;
  tasks: WorkTask[];
}

export const WorkTaskMonthGroup: React.FC<WorkTaskMonthGroupProps> = ({ 
  monthKey, 
  tasks 
}) => {
  // Sort tasks by date (most recent first)
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const [month, year] = monthKey.split('-');
  const displayDate = formatDateMonthYear(new Date(parseInt(year), parseInt(month) - 1));
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">
          {displayDate}
        </h3>
        <Badge variant="outline" className="bg-brand-50 text-brand-700">
          {tasks.length} {tasks.length > 1 ? 'fiches' : 'fiche'}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <WorkTaskItem key={task.id} workTask={task} />
        ))}
      </div>
    </div>
  );
};
