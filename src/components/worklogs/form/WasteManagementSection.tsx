
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Trash2, Recycle, Box } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const WasteManagementSection: React.FC = () => {
  const form = useFormContext();
  const [wasteType, setWasteType] = useState('none');
  const [quantity, setQuantity] = useState('1');

  // Observer les changements de type de déchets
  useEffect(() => {
    const wasteValue = form.watch('wasteManagement');
    if (wasteValue) {
      const parts = wasteValue.split('_');
      if (parts.length >= 2) {
        setWasteType(parts[0]);
        setQuantity(parts[1]);
      } else {
        setWasteType(wasteValue);
        setQuantity('1');
      }
    }
  }, [form.watch('wasteManagement')]);

  // Mettre à jour la valeur combinée
  const updateWasteManagement = (type: string, qty: string) => {
    if (type === 'none') {
      form.setValue('wasteManagement', 'none');
    } else {
      form.setValue('wasteManagement', `${type}_${qty}`);
    }
  };

  // Options de type de déchets simplifiées
  const wasteOptions = [
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
        <div className="grid grid-cols-1 gap-3">
          <FormLabel className="text-sm text-green-700 font-medium">Type de collecte</FormLabel>
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              {wasteOptions.map((option) => (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-green-200 hover:border-green-400 transition-colors">
                      <Checkbox 
                        id={`waste-${option.id}`}
                        checked={wasteType === option.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setWasteType(option.id);
                            updateWasteManagement(option.id, quantity);
                          } else if (wasteType === option.id) {
                            setWasteType('none');
                            updateWasteManagement('none', '0');
                          }
                        }}
                        className="border-green-500 data-[state=checked]:bg-green-600"
                      />
                      <label 
                        htmlFor={`waste-${option.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-green-700 text-white">
                    <p>{option.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {wasteType !== 'none' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-md border border-green-200">
            <FormField
              control={form.control}
              name="wasteQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-green-700">Quantité</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value || "1";
                          setQuantity(value);
                          updateWasteManagement(wasteType, value);
                        }}
                        className="border-green-300 focus:border-green-500"
                      />
                      <span className="ml-3 text-sm text-green-800">unité(s)</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center">
              <Trash2 className="h-5 w-5 text-green-600 mr-2" />
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
