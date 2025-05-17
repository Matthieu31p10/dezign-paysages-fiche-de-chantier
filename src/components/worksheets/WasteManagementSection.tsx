
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Recycle, Trash2, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WasteManagementSection = () => {
  const { control, register, watch, setValue } = useFormContext();
  const wasteManagement = watch('wasteManagement');
  
  // Parse waste management value
  const getWasteType = (value: string) => {
    if (!value || value === 'none') return 'none';
    return value.split('_')[0];
  };
  
  const getWasteQuantity = (value: string) => {
    if (!value || value === 'none') return '1';
    const parts = value.split('_');
    return parts.length > 1 ? parts[1] : '1';
  };
  
  const wasteType = getWasteType(wasteManagement);
  const wasteQuantity = getWasteQuantity(wasteManagement);
  
  // Update the combined waste management value
  const updateWasteManagement = (type: string, quantity: string = '1') => {
    if (type === 'none') {
      setValue('wasteManagement', 'none');
    } else {
      setValue('wasteManagement', `${type}_${quantity}`);
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value || '1';
    updateWasteManagement(wasteType, newQuantity);
  };

  // Options de type de déchets
  const wasteOptions = [
    { id: 'none', label: 'Aucun', description: 'Pas de gestion de déchets' },
    { id: 'big_bag', label: 'Big-bag', description: 'Sac de collecte grande capacité' },
    { id: 'benne', label: 'Benne', description: 'Benne pour déchets verts' },
    { id: 'container', label: 'Container', description: 'Container pour déchets variés' }
  ];
  
  return (
    <Card className="border-amber-200 shadow-sm">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="text-amber-800 flex items-center text-base gap-2">
          <Recycle className="h-5 w-5 text-amber-600" />
          Gestion des déchets
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4">
          <FormItem>
            <FormLabel>Type de collecte</FormLabel>
            <Select 
              value={wasteType}
              onValueChange={(value) => updateWasteManagement(value, wasteQuantity)}
            >
              <SelectTrigger className="w-full bg-white border-amber-200 focus:ring-amber-500">
                <SelectValue placeholder="Sélectionner un type de déchet" />
              </SelectTrigger>
              <SelectContent>
                {wasteOptions.map((option) => (
                  <TooltipProvider key={option.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value={option.id}>{option.label}</SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-amber-700 text-white">
                        <p>{option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          {wasteType !== 'none' && (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    value={wasteQuantity}
                    onChange={handleQuantityChange}
                    className="border-amber-300 focus:border-amber-500"
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
        
        {wasteType !== 'none' && (
          <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-100 flex items-center">
            <Box className="h-5 w-5 mr-2 text-amber-600" />
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
