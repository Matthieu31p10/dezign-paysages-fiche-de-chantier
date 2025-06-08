
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import TimeInputsGrid from './time-tracking/TimeInputsGrid';
import TimeDeviation from './time-tracking/TimeDeviation';
import { useWorkLogForm } from './WorkLogFormContext';
import { Card } from '@/components/ui/card';

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
  const totalTeamHours = totalHours * personnelCount;
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium flex items-center">
        <Clock className="mr-2 h-4 w-4 text-green-600" />
        Suivi du temps
      </h2>
      
      <TimeInputsGrid 
        previousYearsHours={previousYearsHours}
        currentYearTarget={currentYearTarget}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField
          control={control}
          name="totalHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Heures individuelles</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  value={typeof field.value === 'number' ? Number(field.value).toFixed(2) : '0.00'}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="h-9 bg-gradient-to-r from-green-50 to-white border-green-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card className="p-2 border rounded-md bg-gradient-to-r from-green-50 to-white border-green-200">
          <div className="text-xs text-green-700">Heures équipe</div>
          <div className="text-lg font-bold text-green-800">
            {typeof totalTeamHours === 'number' ? Number(totalTeamHours).toFixed(2) : '0.00'}h
          </div>
          <div className="text-xs text-green-600">
            {personnelCount} {personnelCount > 1 ? 'personnes' : 'personne'}
          </div>
        </Card>
        
        {selectedProject && (
          <TimeDeviation
            deviation={timeDeviation || "N/A"}
            deviationClass={timeDeviationClass || "text-gray-600"}
            showInBlankSheets={true}
          />
        )}
      </div>
    </div>
  );
};

export default TimeTrackingSection;
