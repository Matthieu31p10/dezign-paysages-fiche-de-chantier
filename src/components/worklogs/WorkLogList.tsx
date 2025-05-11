
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
  
  // Préparations des données toujours exécutées (pas dans des conditions)
  const sortedWorkLogs = useMemo(() => {
    if (regularWorkLogs.length === 0) {
      return [];
    }
    return [...regularWorkLogs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [regularWorkLogs]);
  
  // Grouper les fiches par mois (toujours exécuté)
  const workLogsByMonth = useMemo(() => {
    if (regularWorkLogs.length === 0) {
      return {};
    }
    return groupWorkLogsByMonth(sortedWorkLogs);
  }, [sortedWorkLogs, regularWorkLogs]);
  
  // Obtenir les mois dans l'ordre chronologique inversé (toujours exécuté)
  const months = useMemo(() => {
    if (regularWorkLogs.length === 0) {
      return [];
    }
    const monthsArray = Object.keys(workLogsByMonth);
    return sortMonths(monthsArray, 'date-desc');
  }, [workLogsByMonth, regularWorkLogs]);
  
  // Show empty state if no logs
  if (regularWorkLogs.length === 0) {
    return <EmptyState message={emptyMessage} projectId={projectId} />;
  }
  
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
