
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

interface TimeInputsProps {
  control: Control<BlankWorkSheetValues>;
  onTimeChange?: () => void;
}

export const TimeInputs = ({ control, onTimeChange }: TimeInputsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <FormField
        control={control}
        name="departure"
        render={({ field }) => (
          <FormItem className="mb-1">
            <FormLabel className="text-sm">Départ</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  if (onTimeChange) onTimeChange();
                }}
                className="h-9"
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
          <FormItem className="mb-1">
            <FormLabel className="text-sm">Arrivée</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  if (onTimeChange) onTimeChange();
                }}
                className="h-9"
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
          <FormItem className="mb-1">
            <FormLabel className="text-sm">Fin de chantier</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  if (onTimeChange) onTimeChange();
                }}
                className="h-9"
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
          <FormItem className="mb-1">
            <FormLabel className="text-sm">Temps de pause</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  if (onTimeChange) onTimeChange();
                }}
                className="h-9"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
