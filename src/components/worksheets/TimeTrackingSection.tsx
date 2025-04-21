
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BlankWorkSheetValues } from './schema';
import { TimeInputs } from './time-tracking/TimeInputs';
import { TimeCalculations } from './time-tracking/TimeCalculations';
import { PersonnelSection } from './time-tracking/PersonnelSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

const TimeTrackingSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const isMobile = useIsMobile();
  
  // Get the current values for calculations
  const totalHours = watch('totalHours') || 0;
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const hourlyRate = watch('hourlyRate') || 0;
  
  // Calculate total team hours and cost
  const totalTeamHours = totalHours * personnelCount;
  const laborCost = totalTeamHours * hourlyRate;

  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    setValue('personnel', selectedPersonnel, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center text-green-800">
        <Clock className="w-5 h-5 mr-2 text-green-600" />
        Suivi du temps
      </h2>
      
      <TimeInputs control={control} />
      
      <TimeCalculations
        control={control}
        totalHours={totalHours}
        personnelCount={personnelCount}
        totalTeamHours={totalTeamHours}
        hourlyRate={hourlyRate}
        laborCost={laborCost}
      />
      
      <PersonnelSection
        control={control}
        selectedPersonnel={personnel}
        onPersonnelChange={handlePersonnelChange}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-gradient-to-r from-green-50 to-white p-4 rounded-md border border-green-200">
        <FormField
          control={control}
          name="signedQuoteAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-green-700">Montant du devis (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="border-green-200 focus:border-green-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="isQuoteSigned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start md:items-center justify-between space-x-3 space-y-0 rounded-md border border-green-200 p-4 shadow-sm">
              <div className="space-y-1 leading-none">
                <FormLabel className="font-medium text-green-700">Devis signé</FormLabel>
                <p className="text-sm text-green-600">
                  Cochez si le devis a été signé par le client
                </p>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 text-green-500 border-green-300 focus:ring-green-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <Card className="p-4 border-green-200 bg-gradient-to-r from-green-50 to-white">
        <FormField
          control={control}
          name="invoiced"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start md:items-center justify-between space-x-3 space-y-0">
              <div className="space-y-1 leading-none">
                <FormLabel className="font-medium text-green-700">Facturé</FormLabel>
                <p className="text-sm text-green-600">
                  Cochez si cette intervention a été facturée
                </p>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="h-4 w-4 text-green-500 border-green-300 focus:ring-green-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};

export default TimeTrackingSection;
