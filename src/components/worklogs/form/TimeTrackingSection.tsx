
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkLogForm } from './WorkLogFormContext';

const TimeTrackingSection: React.FC = () => {
  const { form, timeDeviation, timeDeviationClass } = useWorkLogForm();
  const { control } = form;
  
  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium">Suivi du temps</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <FormField
          control={control}
          name="departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Départ</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="arrival"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Arrivée</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Fin de chantier</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="breakTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Pause (hh:mm)</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  value={field.value.toFixed(2)}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {timeDeviation !== null && (
          <div className="flex items-center px-3 py-2 rounded border bg-muted/30">
            <div className="text-sm">
              <span>Écart:</span> 
              <span className={`ml-2 font-medium ${timeDeviationClass}`}>
                {Math.abs(Number(timeDeviation)).toFixed(2)}h {Number(timeDeviation) >= 0 ? 'sur' : 'sous'} estimé
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTrackingSection;
