
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';

const FinancialSummarySection = () => {
  const { watch } = useFormContext<BlankWorkSheetValues>();
  
  // Get current values
  const hourlyRate = watch('hourlyRate') || 0;
  const totalHours = watch('totalHours') || 0;
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const consumables = watch('consumables') || [];
  
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
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
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
