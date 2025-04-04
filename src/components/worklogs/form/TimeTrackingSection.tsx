
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkLogForm } from './WorkLogFormContext';

const TimeTrackingSection: React.FC = () => {
  const { form } = useWorkLogForm();
  const { control } = form;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Suivi du temps</h2>
      
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
              <FormLabel>Temps de pause (hh:mm)</FormLabel>
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
                value={field.value.toFixed(2)}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeTrackingSection;
