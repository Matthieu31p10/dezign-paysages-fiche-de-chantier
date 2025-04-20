
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Users } from 'lucide-react';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';

interface TimeCalculationsProps {
  control: Control<BlankWorkSheetValues>;
  totalHours: number;
  personnelCount: number;
  totalTeamHours: number;
  hourlyRate: number;
  laborCost: number;
}

export const TimeCalculations: React.FC<TimeCalculationsProps> = ({
  control,
  totalHours,
  personnelCount,
  totalTeamHours,
  hourlyRate,
  laborCost
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      <FormField
        control={control}
        name="totalHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total des heures (calculé)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                readOnly
                value={(field.value || 0).toFixed(2)}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="hourlyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taux horaire (€)</FormLabel>
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
      
      <Card className="border-0 shadow-sm bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-800 mb-1">
            <Users className="h-4 w-4" />
            <span>Équipe: {personnelCount} {personnelCount > 1 ? 'personnes' : 'personne'}</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{totalTeamHours.toFixed(2)}h</div>
          <div className="text-sm text-green-700 mt-1 flex items-center gap-1">
            <Calculator className="h-3.5 w-3.5" />
            <span>Coût: {laborCost.toFixed(2)}€</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
