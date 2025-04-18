
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

interface IndividualHoursFieldProps {
  control: Control<BlankWorkSheetValues>;
  totalHours: number;
}

export const IndividualHoursField = ({ control, totalHours }: IndividualHoursFieldProps) => {
  // S'assurer que totalHours est bien un nombre
  const hoursValue = typeof totalHours === 'number' 
    ? totalHours.toFixed(2) 
    : '0.00';

  return (
    <FormField
      control={control}
      name="totalHours"
      render={({ field }) => (
        <FormItem className="mb-1">
          <FormLabel className="text-sm">Heures individuelles</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              step="0.01"
              readOnly
              value={hoursValue}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              className="bg-muted h-9"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
