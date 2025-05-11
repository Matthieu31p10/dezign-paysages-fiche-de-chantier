
import React from 'react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const TimeTrackingSection: React.FC = () => {
  const { workLog, calculateEndTime } = useWorkLogDetail();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">Suivi du temps</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Départ</p>
          <p>{workLog.timeTracking.departure || '--:--'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Arrivée</p>
          <p>{workLog.timeTracking.arrival || '--:--'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Heure de fin</p>
          <p>{workLog.timeTracking.end || calculateEndTime()}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Pause</p>
          <p>{workLog.timeTracking.breakTime || '00:00'}</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingSection;
