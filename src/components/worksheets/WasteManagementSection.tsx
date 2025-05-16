
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
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Recycle, Trash2, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

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
            <TooltipProvider>
              <RadioGroup 
                value={wasteType}
                onValueChange={(value) => updateWasteManagement(value, wasteQuantity)}
                className="flex flex-wrap gap-3 mt-2"
              >
                <div className="flex items-center space-x-2 bg-white p-3 rounded-md border hover:border-amber-400 transition-colors">
                  <RadioGroupItem value="none" id="waste-none" />
                  <Label htmlFor="waste-none" className="cursor-pointer">Aucun</Label>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-md border hover:border-amber-400 transition-colors">
                      <RadioGroupItem value="big_bag" id="waste-big_bag" />
                      <Label htmlFor="waste-big_bag" className="cursor-pointer">Big-bag</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-amber-700 text-white">
                    <p>Sac de collecte grande capacité</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-md border hover:border-amber-400 transition-colors">
                      <RadioGroupItem value="benne" id="waste-benne" />
                      <Label htmlFor="waste-benne" className="cursor-pointer">Benne</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-amber-700 text-white">
                    <p>Benne pour déchets verts</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-md border hover:border-amber-400 transition-colors">
                      <RadioGroupItem value="container" id="waste-container" />
                      <Label htmlFor="waste-container" className="cursor-pointer">Container</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-amber-700 text-white">
                    <p>Container pour déchets variés</p>
                  </TooltipContent>
                </Tooltip>
              </RadioGroup>
            </TooltipProvider>
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
