
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';

interface TimeInputsProps {
  control: Control<BlankWorkSheetValues>;
}

export const TimeInputs: React.FC<TimeInputsProps> = ({ control }) => {
  return (
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
  );
};
