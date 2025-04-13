
import React from 'react';
import TimeInput from './TimeInput';

interface TimeInputsGridProps {
  previousYearsHours?: number;
  currentYearTarget?: number;
}

const TimeInputsGrid: React.FC<TimeInputsGridProps> = ({ 
  previousYearsHours = 0,
  currentYearTarget = 0
}) => {
  // Calculate remaining hours for current year
  const remainingHours = Math.max(0, currentYearTarget - previousYearsHours);
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <TimeInput name="departure" label="Départ" />
        <TimeInput name="arrival" label="Arrivée" />
        <TimeInput name="end" label="Fin de chantier" />
        <TimeInput name="breakTime" label="Pause (hh:mm)" />
      </div>
      
      {(previousYearsHours > 0 || currentYearTarget > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center px-3 py-2 rounded border bg-muted/30">
            <div className="text-sm">
              <span>Cumul des années précédentes:</span> 
              <span className="ml-2 font-medium">
                {previousYearsHours.toFixed(2)}h
              </span>
            </div>
          </div>
          
          <div className="flex items-center px-3 py-2 rounded border bg-muted/30">
            <div className="text-sm">
              <span>Reste à effectuer cette année:</span> 
              <span className="ml-2 font-medium">
                {remainingHours.toFixed(2)}h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInputsGrid;
