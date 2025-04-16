
import React from 'react';
import TimeInput from './TimeInput';
import { Clock, Calendar, Info } from 'lucide-react';

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
        <div className="border p-3 rounded-md bg-green-50 shadow-sm">
          <h3 className="text-sm font-medium mb-2 flex items-center text-green-700">
            <Clock className="h-4 w-4 mr-2" />
            Les heures des années précédentes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center px-3 py-2 rounded border bg-white">
              <div className="text-sm">
                <span className="text-gray-600">Cumul des années précédentes:</span> 
                <span className="ml-2 font-medium text-green-700">
                  {previousYearsHours.toFixed(2)}h
                </span>
              </div>
            </div>
            
            <div className="flex items-center px-3 py-2 rounded border bg-white">
              <div className="text-sm">
                <span className="text-gray-600">Reste à effectuer cette année:</span> 
                <span className="ml-2 font-medium text-green-700">
                  {remainingHours.toFixed(2)}h
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInputsGrid;
