
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Recycle, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WasteManagementSection = () => {
  const { control, register, watch } = useFormContext();
  const wasteManagement = watch('wasteManagement');
  
  return (
    <Card className="border-amber-200 shadow-sm">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="text-amber-800 flex items-center text-base gap-2">
          <Recycle className="h-5 w-5 text-amber-600" />
          Gestion des déchets
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="wasteManagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de déchets</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-amber-300 focus:border-amber-500">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Aucun déchet</SelectItem>
                          <SelectItem value="big_bag">Big-bag</SelectItem>
                          <SelectItem value="half_dumpster">½ Benne</SelectItem>
                          <SelectItem value="dumpster">Benne complète</SelectItem>
                          <SelectItem value="small_container">Petit container</SelectItem>
                          <SelectItem value="large_container">Grand container</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-amber-700 text-white">
                      <p>Sélectionnez le type de collecte de déchets</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormItem>
            )}
          />
          
          {wasteManagement && wasteManagement !== 'none' && (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Nombre d'unités"
                    className="border-amber-300 focus:border-amber-500"
                    {...register('wasteQuantity', { 
                      valueAsNumber: true 
                    })}
                  />
                  <span className="ml-3 text-sm text-amber-800">unité(s)</span>
                </div>
              </FormControl>
              <FormDescription>
                Indiquez le nombre d'unités pour ce type de déchets
              </FormDescription>
            </FormItem>
          )}
        </div>
        
        {wasteManagement && wasteManagement !== 'none' && (
          <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-100 flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-sm text-amber-800">
              Les déchets seront traités selon les normes environnementales en vigueur.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WasteManagementSection;
