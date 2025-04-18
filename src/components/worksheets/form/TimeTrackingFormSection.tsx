
import React from 'react';
import { Clock } from 'lucide-react';
import { TimeInputs } from './time-tracking/TimeInputs';
import { TimeCalculations } from './time-tracking/TimeCalculations';
import { useTimeTracking } from './hooks/useTimeTracking';

interface TimeTrackingFormSectionProps {
  onTimeChange?: () => void;
}

const TimeTrackingFormSection: React.FC<TimeTrackingFormSectionProps> = ({ 
  onTimeChange 
}) => {
  const {
    control,
    totalHours,
    personnelCount,
    totalTeamHours
  } = useTimeTracking(onTimeChange);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
        Suivi du temps
      </h2>
      
      <TimeInputs control={control} onTimeChange={onTimeChange} />
      
      <TimeCalculations 
        control={control}
        totalHours={totalHours}
        personnelCount={personnelCount}
        totalTeamHours={totalTeamHours}
      />
    </div>
  );
};

export default TimeTrackingFormSection;
