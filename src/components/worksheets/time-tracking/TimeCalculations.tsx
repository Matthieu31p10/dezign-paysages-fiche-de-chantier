
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Euro, Users, Clock } from 'lucide-react';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { formatNumber } from '@/utils/helpers';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-4">Calculs</h3>
        
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2 md:grid-cols-4'} gap-4`}>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
              Heures totales (individu)
            </span>
            <span className="text-lg font-medium">{Number(totalHours).toFixed(2)} h</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center">
              <Users className="w-3 h-3 mr-1 text-muted-foreground" />
              Personnel présent
            </span>
            <span className="text-lg font-medium">{personnelCount} personne{personnelCount > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
              Heures totales (équipe)
            </span>
            <span className="text-lg font-medium">{Number(totalTeamHours).toFixed(2)} h</span>
          </div>
          
          <FormField
            control={control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground flex items-center">
                  <Euro className="w-3 h-3 mr-1 text-muted-foreground" />
                  Taux horaire (€)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-full"
                    value={field.value || 0}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Coût main d'œuvre</span>
            <span className="text-lg font-bold text-primary">{Number(laborCost).toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
