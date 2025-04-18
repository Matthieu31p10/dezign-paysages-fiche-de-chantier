
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

interface HourlyRateFieldProps {
  control: Control<BlankWorkSheetValues>;
}

export const HourlyRateField = ({ control }: HourlyRateFieldProps) => {
  return (
    <FormField
      control={control}
      name="hourlyRate"
      render={({ field }) => (
        <FormItem className="mb-1">
          <FormLabel className="text-sm">Taux horaire (€/h)</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  field.onChange(value);
                }}
                className="h-9"
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
  );
};
