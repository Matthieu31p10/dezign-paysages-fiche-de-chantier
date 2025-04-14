
import React from 'react';
import { WorkLog } from '@/types/models';
import { groupWorkLogsByMonth } from '@/utils/date-helpers';
import { getYearsFromWorkLogs } from '@/utils/date-helpers';
import WorkLogMonthGroup from './list/WorkLogMonthGroup';

interface WorkLogListProps {
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogList: React.FC<WorkLogListProps> = ({ workLogs, projectId }) => {
  // Trier d'abord par date (plus récent en premier)
  const sortedWorkLogs = [...workLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Grouper les fiches par mois
  const workLogsByMonth = groupWorkLogsByMonth(sortedWorkLogs);
  
  // Obtenir les mois dans l'ordre chronologique inversé (plus récent en premier)
  const months = Object.keys(workLogsByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    
    // Comparer d'abord par année
    if (yearA !== yearB) {
      return parseInt(yearB) - parseInt(yearA);
    }
    
    // Même année, comparer les mois
    const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return monthNames.indexOf(monthB.toLowerCase()) - monthNames.indexOf(monthA.toLowerCase());
  });
  
  return (
    <div className="space-y-8">
      {months.map((month, index) => (
        <WorkLogMonthGroup 
          key={month} 
          month={month} 
          workLogs={workLogsByMonth[month]}
          projectId={projectId}
        />
      ))}
    </div>
  );
};

export default WorkLogList;
