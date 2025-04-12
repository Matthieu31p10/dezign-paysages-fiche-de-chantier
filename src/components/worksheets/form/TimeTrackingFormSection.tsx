
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface TimeTrackingFormSectionProps {
  onTimeChange?: () => void;
}

const TimeTrackingFormSection: React.FC<TimeTrackingFormSectionProps> = ({ 
  onTimeChange 
}) => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const totalHours = watch('totalHours');
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
        Suivi du temps
      </h2>
      
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
    </div>
  );
};

export default TimeTrackingFormSection;
