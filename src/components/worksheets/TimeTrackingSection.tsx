import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BlankWorkSheetValues } from './schema';
import { Clock, Users, Calculator } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';

const TimeTrackingSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const { teams } = useApp();
  
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Départ</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="arrival"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrivée</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fin de chantier</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="breakTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temps de pause (hh:mm)</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
      
      <Card>
        <CardContent className="pt-4">
          <h3 className="text-sm font-medium mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            Personnel Présent
          </h3>
          <FormField
            control={control}
            name="personnel"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PersonnelDialog
                    selectedPersonnel={personnel}
                    onChange={handlePersonnelChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
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
