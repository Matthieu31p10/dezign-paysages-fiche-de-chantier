
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkLogForm } from '../WorkLogFormContext';

const TotalHoursDisplay: React.FC = () => {
  const { form } = useWorkLogForm();
  const { control } = form;
  
  return (
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
  );
};

export default TotalHoursDisplay;
