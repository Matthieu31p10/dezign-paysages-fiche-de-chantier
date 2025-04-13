
import React from 'react';
import { useWorkLogForm } from './WorkLogFormContext';
import TimeInputsGrid from './time-tracking/TimeInputsGrid';
import TotalHoursDisplay from './time-tracking/TotalHoursDisplay';
import TimeDeviation from './time-tracking/TimeDeviation';

const TimeTrackingSection: React.FC = () => {
  const { timeDeviation, timeDeviationClass } = useWorkLogForm();
  
  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium">Suivi du temps</h2>
      
      <TimeInputsGrid />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TotalHoursDisplay />
        
        {timeDeviation !== null && (
          <TimeDeviation 
            deviation={timeDeviation}
            deviationClass={timeDeviationClass}
          />
        )}
      </div>
    </div>
  );
};

export default TimeTrackingSection;
