
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator } from 'lucide-react';

const FinancialSummarySection: React.FC = () => {
  const { control, watch } = useFormContext<BlankWorkSheetValues>();
  
  // Watch relevant values for calculations
  const totalHours = watch('totalHours') || 0;
  const personnelCount = (watch('personnel') || []).length || 1;
  const hourlyRate = watch('hourlyRate') || 0;
  const consumables = watch('consumables') || [];
  
  // Calculate totals
  const totalTeamHours = totalHours * personnelCount;
  const totalLaborCost = totalTeamHours * hourlyRate;
  const totalConsumablesCost = consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalEstimate = totalLaborCost + totalConsumablesCost;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-muted-foreground" />
        Bilan financier
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="signedQuoteAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant du devis (€)</FormLabel>
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
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Montant du devis convenu avec le client
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isQuoteSigned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Devis signé
                </FormLabel>
                <FormDescription>
                  Cochez si le devis a été accepté par le client
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
        <div>
          <h3 className="text-sm font-medium mb-2">Résumé des coûts</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Main d'œuvre:</span>
              <span className="font-medium">{totalLaborCost.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fournitures:</span>
              <span className="font-medium">{totalConsumablesCost.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-1 border-t">
              <span>Total estimé:</span>
              <span>{totalEstimate.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {watch('signedQuoteAmount') > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Comparaison avec le devis</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Devis:</span>
                <span className="font-medium">{(watch('signedQuoteAmount') || 0).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Coûts estimés:</span>
                <span className="font-medium">{totalEstimate.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-1 border-t">
                <span>Différence:</span>
                <span className={((watch('signedQuoteAmount') || 0) >= totalEstimate) ? 'text-green-600' : 'text-red-600'}>
                  {((watch('signedQuoteAmount') || 0) - totalEstimate).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSummarySection;
