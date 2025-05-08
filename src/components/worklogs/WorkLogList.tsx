
import React, { useMemo } from 'react';
import { WorkLog } from '@/types/models';
import { groupWorkLogsByMonth } from '@/utils/date-helpers';
import WorkLogMonthGroup from './list/WorkLogMonthGroup';
import EmptyState from './list/EmptyState';
import { sortMonths } from './list/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkLogListProps {
  workLogs: WorkLog[];
  projectId?: string;
  emptyMessage?: string;
}

const WorkLogList: React.FC<WorkLogListProps> = ({ 
  workLogs, 
  projectId,
  emptyMessage = "Aucune fiche de suivi" 
}) => {
  const isMobile = useIsMobile();
  
  // Filtrer pour n'afficher que les fiches de suivi standard (pas les fiches vierges)
  const regularWorkLogs = useMemo(() => {
    return workLogs.filter(log => !log.isBlankWorksheet);
  }, [workLogs]);
  
  // Show empty state if no logs
  if (regularWorkLogs.length === 0) {
    return <EmptyState message={emptyMessage} projectId={projectId} />;
  }
  
  // Trier d'abord par date (plus récent en premier)
  const sortedWorkLogs = useMemo(() => {
    return [...regularWorkLogs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [regularWorkLogs]);
  
  // Grouper les fiches par mois
  const workLogsByMonth = useMemo(() => {
    return groupWorkLogsByMonth(sortedWorkLogs);
  }, [sortedWorkLogs]);
  
  // Obtenir les mois dans l'ordre chronologique inversé (plus récent en premier)
  const months = useMemo(() => {
    const monthsArray = Object.keys(workLogsByMonth);
    return sortMonths(monthsArray, 'date-desc');
  }, [workLogsByMonth]);
  
  return (
    <div className={`space-y-${isMobile ? '4' : '8'} animate-fade-in`}>
      {months.map((month) => (
        <WorkLogMonthGroup 
          key={month} 
          month={month} 
          workLogs={workLogsByMonth[month]}
          projectId={projectId}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default WorkLogList;
