
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkLogForm } from '../WorkLogFormContext';
import { Clock, ArrowDown, ArrowUp, Timer, Coffee } from 'lucide-react';

interface TimeInputProps {
  name: 'departure' | 'arrival' | 'end' | 'breakTime';
  label: string;
  icon?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ name, label, icon }) => {
  const { form } = useWorkLogForm();
  const { control } = form;
  
  const getIcon = () => {
    switch (icon) {
      case 'departure':
        return <ArrowDown className="h-4 w-4 mr-2 text-green-600" />;
      case 'arrival':
        return <ArrowUp className="h-4 w-4 mr-2 text-green-600" />;
      case 'end':
        return <Clock className="h-4 w-4 mr-2 text-green-600" />;
      case 'break':
        return <Coffee className="h-4 w-4 mr-2 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 mr-2 text-green-600" />;
    }
  };
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm flex items-center">
            {icon && getIcon()}
            {label}
          </FormLabel>
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
