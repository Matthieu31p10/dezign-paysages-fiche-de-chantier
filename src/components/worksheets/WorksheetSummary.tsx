
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, FileCheck, Wallet } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const WorksheetSummary: React.FC = () => {
  const { watch, setValue } = useFormContext<BlankWorkSheetValues>();
  
  const totalHours = watch('totalHours');
  const hourlyRate = watch('hourlyRate') || 0;
  const consumables = watch('consumables') || [];
  const vatRate = watch('vatRate') || "20";
  const signedQuote = watch('signedQuote') || false;
  const quoteValue = watch('quoteValue') || 0;
  
  // Calcul du coût total de la main d'œuvre
  const laborCost = totalHours * hourlyRate;
  
  // Calcul du coût total des consommables
  const consumablesCost = consumables.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calcul du total HT
  const totalHT = laborCost + consumablesCost;
  
  // Calcul de la TVA
  const vatAmount = totalHT * (parseInt(vatRate) / 100);
  
  // Calcul du total TTC
  const totalTTC = totalHT + vatAmount;
  
  // Différence entre devis et réalisation
  const difference = quoteValue > 0 ? (quoteValue - totalHT).toFixed(2) : '0.00';
  
  // Gestion du changement de taux de TVA
  const handleVatRateChange = (value: string) => {
    setValue('vatRate', value as "10" | "20");
  };
  
  // Gestion du changement du statut "Devis signé"
  const handleSignedQuoteChange = (checked: boolean) => {
    setValue('signedQuote', checked);
  };
  
  // Gestion du changement de la valeur du devis
  const handleQuoteValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setValue('quoteValue', value);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-muted-foreground" />
        Bilan de l'intervention
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          name="vatRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taux de TVA</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={handleVatRateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un taux de TVA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="signedQuote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={handleSignedQuoteChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center cursor-pointer">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Devis signé
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            name="quoteValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Valeur devis HT
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={field.value || ''}
                      onChange={e => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">€</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Main d'œuvre</td>
                  <td className="py-2 text-right font-medium">
                    {totalHours.toFixed(2)} h x {hourlyRate.toFixed(2)} € = {laborCost.toFixed(2)} €
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Consommables</td>
                  <td className="py-2 text-right font-medium">{consumablesCost.toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Total HT</td>
                  <td className="py-2 text-right font-bold">{totalHT.toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">TVA ({vatRate}%)</td>
                  <td className="py-2 text-right font-medium">{vatAmount.toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">TOTAL TTC</td>
                  <td className="py-2 text-right font-bold">{totalTTC.toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Devis signé</td>
                  <td className="py-2 text-right font-medium">{signedQuote ? 'Oui' : 'Non'}</td>
                </tr>
                {quoteValue > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Différence Devis/Réalisation HT</td>
                    <td className={`py-2 text-right font-medium ${parseFloat(difference) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {difference} €
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorksheetSummary;
