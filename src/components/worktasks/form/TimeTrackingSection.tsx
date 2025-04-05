
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTimeCalculations } from './useTimeCalculations';

const TimeTrackingSection = () => {
  const form = useFormContext();
  const { calculateTimeValues } = useTimeCalculations();
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('timeTracking.')) {
        calculateTimeValues(form);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, calculateTimeValues, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi du temps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="timeTracking.departure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de départ</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeTracking.arrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure d'arrivée</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeTracking.end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="timeTracking.breakTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temps de pause</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormDescription>Format: HH:MM</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <FormLabel>Temps de déplacement</FormLabel>
            <div className="border rounded-md p-2 bg-muted/50">
              {form.watch('timeTracking.travelHours')?.toFixed(2) || "0.00"} h
            </div>
          </div>
          
          <div>
            <FormLabel>Temps de travail</FormLabel>
            <div className="border rounded-md p-2 bg-muted/50">
              {form.watch('timeTracking.workHours')?.toFixed(2) || "0.00"} h
            </div>
          </div>
          
          <div>
            <FormLabel>Temps total</FormLabel>
            <div className="border rounded-md p-2 bg-muted/50">
              {form.watch('timeTracking.totalHours')?.toFixed(2) || "0.00"} h
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taux horaire (€/h)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TimeTrackingSection;
