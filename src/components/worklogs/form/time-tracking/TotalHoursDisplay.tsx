
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TotalHoursDisplayProps {
  value: number;
  onChange: (value: number) => void;
}

const TotalHoursDisplay: React.FC<TotalHoursDisplayProps> = ({ value, onChange }) => {
  return (
    <FormItem>
      <FormLabel className="text-sm">Heures (auto)</FormLabel>
      <FormControl>
        <Input 
          type="number" 
          step="0.01"
          readOnly
          value={Number(value).toFixed(2)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TotalHoursDisplay;
