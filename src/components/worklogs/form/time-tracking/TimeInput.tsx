
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkLogForm } from '../WorkLogFormContext';

interface TimeInputProps {
  name: 'departure' | 'arrival' | 'end' | 'breakTime';
  label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ name, label }) => {
  const { form } = useWorkLogForm();
  const { control } = form;
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
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
  );
};

export default TimeInput;
