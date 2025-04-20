import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { TimeInputs } from './time-tracking/TimeInputs';
import { TimeCalculations } from './time-tracking/TimeCalculations';
import { PersonnelSection } from './time-tracking/PersonnelSection';

const TimeTrackingSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  
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
      <h2 className="text-lg font-medium flex items-center">
        <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <FormField
          control={control}
          name="signedQuoteAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant du devis (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <div className="space-y-1 leading-none">
                <FormLabel>Devis signé</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Cochez si le devis a été signé par le client
                </p>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="invoiced"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
            <div className="space-y-1 leading-none">
              <FormLabel>Facturé</FormLabel>
              <p className="text-sm text-muted-foreground">
                Cochez si cette intervention a été facturée
              </p>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value || false}
                onChange={field.onChange}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeTrackingSection;
