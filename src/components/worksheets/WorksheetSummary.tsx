
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';

const WorksheetSummary: React.FC = () => {
  const { watch } = useFormContext<BlankWorkSheetValues>();
  
  const totalHours = watch('totalHours');
  const hourlyRate = watch('hourlyRate') || 0;
  const consumables = watch('consumables') || [];
  
  // Calcul du coût total de la main d'œuvre
  const laborCost = totalHours * hourlyRate;
  
  // Calcul du coût total des consommables
  const consumablesCost = consumables.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calcul du total général
  const totalCost = laborCost + consumablesCost;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-muted-foreground" />
        Bilan de l'intervention
      </h2>
      
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
                <tr>
                  <td className="py-2 font-semibold">TOTAL</td>
                  <td className="py-2 text-right font-bold">{totalCost.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorksheetSummary;
