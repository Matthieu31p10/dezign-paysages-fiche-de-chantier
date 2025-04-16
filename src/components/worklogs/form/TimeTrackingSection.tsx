
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import TimeInputsGrid from './time-tracking/TimeInputsGrid';
import TimeDeviation from './time-tracking/TimeDeviation';
import TotalHoursDisplay from './time-tracking/TotalHoursDisplay';
import { useWorkLogForm } from './WorkLogFormContext';

interface TimeTrackingSectionProps {
  previousYearsHours?: number;
  currentYearTarget?: number;
}

const TimeTrackingSection: React.FC<TimeTrackingSectionProps> = ({ 
  previousYearsHours = 0,
  currentYearTarget = 0 
}) => {
  const { form, timeDeviation, timeDeviationClass } = useWorkLogForm();
  const { control, watch } = form;
  
  const totalHours = watch('totalHours') || 0;
  const selectedPersonnel = watch('personnel') || [];
  const personnelCount = selectedPersonnel.length || 1;
  
  // Calculate total team hours
  const totalTeamHours = totalHours * personnelCount;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          Suivi du temps
        </h2>
      </div>
      
      <TimeInputsGrid 
        previousYearsHours={previousYearsHours}
        currentYearTarget={currentYearTarget}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <FormField
          control={control}
          name="totalHours"
          render={({ field }) => (
            <TotalHoursDisplay
              value={field.value || 0}
              onChange={field.onChange}
            />
          )}
        />
        
        <div className="space-y-2 p-3 border rounded-md bg-gray-50">
          <Label className="text-sm">Heures équipe totales</Label>
          <div className="text-xl font-bold">{totalTeamHours.toFixed(2)}h</div>
          <div className="text-xs text-muted-foreground">
            Pour {personnelCount} {personnelCount > 1 ? 'personnes' : 'personne'}
          </div>
        </div>
        
        {timeDeviation && (
          <TimeDeviation
            deviation={timeDeviation}
            deviationClass={timeDeviationClass}
          />
        )}
      </div>
      
      <Separator className="my-6" />
    </div>
  );
};

export default TimeTrackingSection;
