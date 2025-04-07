
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

const TimeTrackingFormSection: React.FC = () => {
  const { control, watch } = useFormContext<BlankWorkSheetValues>();
  const totalHours = watch('totalHours');
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
        Suivi du temps
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Départ</FormLabel>
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
              <FormLabel>Arrivée</FormLabel>
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
              <FormLabel>Fin de chantier</FormLabel>
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
              <FormLabel>Temps de pause</FormLabel>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="totalHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total des heures (calculé automatiquement)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  readOnly
                  value={totalHours.toFixed(2)}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taux horaire (€/h)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-muted-foreground">€/h</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TimeTrackingFormSection;
