
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import TimeInputsGrid from './time-tracking/TimeInputsGrid';
import TimeDeviation from './time-tracking/TimeDeviation';
import { useWorkLogForm } from './WorkLogFormContext';

interface TimeTrackingSectionProps {
  previousYearsHours?: number;
  currentYearTarget?: number;
}

const TimeTrackingSection: React.FC<TimeTrackingSectionProps> = ({ 
  previousYearsHours = 0,
  currentYearTarget = 0 
}) => {
  const { form, timeDeviation, timeDeviationClass, selectedProject } = useWorkLogForm();
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
          <Clock className="mr-2 h-5 w-5 text-green-600" />
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
            <FormItem>
              <FormLabel className="text-sm">Heures (auto)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  readOnly
                  value={(field.value || 0).toFixed(2)}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="bg-gradient-to-r from-green-50 to-white border-green-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2 p-3 border rounded-md bg-gradient-to-r from-green-50 to-white border-green-200">
          <Label className="text-sm text-green-700">Heures équipe totales</Label>
          <div className="text-xl font-bold text-green-800">{totalTeamHours.toFixed(2)}h</div>
          <div className="text-xs text-green-600">
            Pour {personnelCount} {personnelCount > 1 ? 'personnes' : 'personne'}
          </div>
        </div>
        
        {selectedProject && (
          <TimeDeviation
            deviation={timeDeviation || "N/A"}
            deviationClass={timeDeviationClass || "text-gray-600"}
            showInBlankSheets={true}
          />
        )}
      </div>
      
      <Separator className="my-6 bg-green-200" />
    </div>
  );
};

export default TimeTrackingSection;
