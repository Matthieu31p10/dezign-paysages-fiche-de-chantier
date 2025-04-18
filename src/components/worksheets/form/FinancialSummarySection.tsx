
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const FinancialSummarySection = () => {
  const { watch, control } = useFormContext<BlankWorkSheetValues>();
  
  // Get current values
  const hourlyRate = watch('hourlyRate') || 0;
  const totalHours = watch('totalHours') || 0;
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const consumables = watch('consumables') || [];
  const isQuoteSigned = watch('isQuoteSigned') || false;
  
  // Calculate totals
  const totalTeamHours = totalHours * personnelCount;
  const laborCost = totalTeamHours * hourlyRate;
  const consumablesTotalCost = consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalCost = laborCost + consumablesTotalCost;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Euro className="h-4 w-4" />
          Bilan financier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hourly Rate Field */}
        <FormField
          control={control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taux horaire (€/h)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Signed Quote Field */}
        <FormField
          control={control}
          name="isQuoteSigned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Devis signé</FormLabel>
                <FormDescription>
                  Cette intervention fait-elle l'objet d'un devis signé?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Quote Amount (conditional display) */}
        {isQuoteSigned && (
          <FormField
            control={control}
            name="signedQuoteAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant du devis signé (€ HT)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium">Main d'œuvre</p>
            <p className="text-lg font-bold">{laborCost.toFixed(2)}€</p>
            <p className="text-xs text-muted-foreground">
              {totalTeamHours.toFixed(2)}h × {hourlyRate.toFixed(2)}€/h
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Fournitures</p>
            <p className="text-lg font-bold">{consumablesTotalCost.toFixed(2)}€</p>
            <p className="text-xs text-muted-foreground">
              {consumables.length} articles
            </p>
          </div>
          
          <div className="col-span-2 border-t pt-3 mt-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Coût total</p>
              <p className="text-xl font-bold">{totalCost.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummarySection;
