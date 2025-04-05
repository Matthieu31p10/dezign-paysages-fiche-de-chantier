
import React from 'react';
import { Link } from 'react-router-dom';
import { WorkTask } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { groupWorkTasksByMonth } from './list/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, FileText, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WorkTaskMonthGroup } from './list/WorkTaskMonthGroup';
import { EmptyState } from '../worklogs/list/EmptyState';
import { NoResultsState } from '../worklogs/list/NoResultsState';

interface WorkTaskListProps {
  workTasks: WorkTask[];
}

const WorkTaskList: React.FC<WorkTaskListProps> = ({ workTasks }) => {
  if (workTasks.length === 0) {
    return <EmptyState entityName="fiches de travaux" newPath="/worktasks/new" />;
  }

  const groupedTasks = groupWorkTasksByMonth(workTasks);
  
  if (Object.keys(groupedTasks).length === 0) {
    return <NoResultsState entityName="fiches de travaux" />;
  }
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([monthKey, tasks]) => (
        <WorkTaskMonthGroup 
          key={monthKey} 
          monthKey={monthKey} 
          tasks={tasks} 
        />
      ))}
    </div>
  );
};

export default WorkTaskList;
