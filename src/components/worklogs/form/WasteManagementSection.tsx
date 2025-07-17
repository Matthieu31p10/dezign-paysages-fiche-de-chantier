
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Trash2, Recycle, Box } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkLogForm } from './WorkLogFormContext';

const WasteManagementSection: React.FC = () => {
  const { form } = useWorkLogForm();
  
  // Parse waste management value to get type and quantity
  const wasteManagement = form.watch('wasteManagement') || 'none';
  
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
  const quantity = getWasteQuantity(wasteManagement);
  
  // Update combined waste management value
  const updateWasteManagement = (type: string, qty: string = '1') => {
    if (type === 'none') {
      form.setValue('wasteManagement', 'none');
    } else {
      form.setValue('wasteManagement', `${type}_${qty}`);
    }
    // Trigger validation
    form.trigger('wasteManagement');
  };

  // Waste type options
  const wasteOptions = [
    { id: 'none', label: 'Aucun', description: 'Pas de gestion de déchets' },
    { id: 'big_bag', label: 'Big-bag', description: 'Sac de collecte grande capacité' },
    { id: 'benne', label: 'Benne', description: 'Benne pour déchets verts' },
    { id: 'container', label: 'Container', description: 'Container pour déchets variés' }
  ];

  return (
    <div className="space-y-4 rounded-md p-5 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm">
      <h3 className="text-base font-medium flex items-center gap-2 text-green-800">
        <Recycle className="w-5 h-5 text-green-700" />
        <span>Gestion des déchets</span>
        {wasteType !== 'none' && (
          <Badge variant="secondary" className="bg-green-200 text-green-800 ml-2">
            Activé
          </Badge>
        )}
      </h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="wasteManagement"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm text-green-700 font-medium">Type de collecte</FormLabel>
              <FormControl>
                <Select 
                  value={wasteType} 
                  onValueChange={(value) => updateWasteManagement(value, quantity)}
                >
                  <SelectTrigger className="w-full bg-white border-green-200 focus:ring-green-500">
                    <SelectValue placeholder="Sélectionner un type de déchet" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {wasteOptions.map((option) => (
                      <TooltipProvider key={option.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={option.id}>{option.label}</SelectItem>
                          </TooltipTrigger>
                          <TooltipContent className="bg-green-700 text-white">
                            <p>{option.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {wasteType !== 'none' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card p-4 rounded-md border border-green-200">
            <div>
              <FormLabel className="text-sm text-green-700">Quantité</FormLabel>
              <div className="flex items-center mt-1">
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value || "1";
                    updateWasteManagement(wasteType, value);
                  }}
                  className="border-green-300 focus:border-green-500"
                />
                <span className="ml-3 text-sm text-green-800">unité(s)</span>
              </div>
              <FormDescription className="text-xs text-green-600 mt-1">
                Nombre d'unités pour ce type de déchets
              </FormDescription>
            </div>

            <div className="flex items-center">
              <Box className="h-5 w-5 text-green-600 mr-2" />
              <div className="text-sm">
                <p className="font-medium">Traitement sélectionné:</p>
                <p className="text-green-800">
                  {quantity} × {wasteOptions.find(w => w.id === wasteType)?.label || wasteType}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteManagementSection;
