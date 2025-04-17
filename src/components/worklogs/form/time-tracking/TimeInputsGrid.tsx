
import React from 'react';
import { useWorkLogForm } from '../WorkLogFormContext';
import TimeInput from './TimeInput';
import { Label } from '@/components/ui/label';

interface TimeInputsGridProps {
  previousYearsHours?: number;
  currentYearTarget?: number;
}

const TimeInputsGrid: React.FC<TimeInputsGridProps> = ({ 
  previousYearsHours = 0,
  currentYearTarget = 0
}) => {
  const { form, selectedProject, existingWorkLogs = [] } = useWorkLogForm();
  const { control, watch } = form;
  
  const projectId = watch('projectId');
  
  // Calculate hours already done this year
  const currentYear = new Date().getFullYear();
  const currentYearWorkLogs = existingWorkLogs.filter(log => 
    log.projectId === projectId && 
    new Date(log.date).getFullYear() === currentYear
  );
  
  const currentYearHours = currentYearWorkLogs.reduce((total, log) => {
    const hours = log.timeTracking?.totalHours || 0;
    return total + (typeof hours === 'string' ? parseFloat(hours) : hours);
  }, 0);
  
  // Calculate remaining hours for the current year
  const remainingHours = Math.max(0, currentYearTarget - currentYearHours);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <TimeInput 
        name="departure"
        label="Départ"
        icon="departure"
      />
      
      <TimeInput 
        name="arrival"
        label="Arrivée"
        icon="arrival"
      />
      
      <TimeInput 
        name="end"
        label="Fin de chantier"
        icon="end"
      />
      
      <TimeInput 
        name="breakTime"
        label="Temps de pause (hh:mm)"
        icon="break"
      />
      
      {selectedProject && (
        <>
          <div className="col-span-2 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 bg-green-50 p-3 rounded-md border border-green-200">
            <div className="space-y-1">
              <Label className="text-sm text-green-700">Objectif annuel</Label>
              <div className="text-lg font-semibold text-green-800">{currentYearTarget.toFixed(1)}h</div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm text-green-700">Heures effectuées cette année</Label>
              <div className="text-lg font-semibold text-blue-700">{currentYearHours.toFixed(1)}h</div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm text-green-700">Reste à effectuer cette année</Label>
              <div className="text-lg font-semibold text-amber-600">{remainingHours.toFixed(1)}h</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeInputsGrid;
