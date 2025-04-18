
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

interface TimeCalculationsProps {
  control: Control<BlankWorkSheetValues>;
  totalHours: number;
  personnelCount: number;
  totalTeamHours: number;
}

export const TimeCalculations = ({ 
  control, 
  totalHours, 
  personnelCount, 
  totalTeamHours 
}: TimeCalculationsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
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
                value={totalHours.toFixed(2)}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="bg-muted h-9"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-1 mb-1">
        <FormLabel className="text-sm">Total équipe ({personnelCount} pers.)</FormLabel>
        <Input 
          type="number" 
          readOnly
          value={totalTeamHours.toFixed(2)}
          className="bg-muted h-9"
        />
        <FormMessage />
      </div>
      
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
    </div>
  );
};
