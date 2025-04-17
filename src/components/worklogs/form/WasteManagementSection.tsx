
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, CheckSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

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

  // Options de type de déchets
  const wasteOptions = [
    { id: 'big_bag', label: 'Big-bag' },
    { id: 'half_dumpster', label: '½ Benne' },
    { id: 'dumpster', label: 'Benne' },
    { id: 'small_container', label: 'Petit container' },
    { id: 'large_container', label: 'Grand container' }
  ];

  return (
    <div className="space-y-4 rounded-md p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
      <h3 className="text-base font-medium flex items-center text-green-800">
        <Trash2 className="w-4 h-4 mr-2 text-green-600" />
        Gestion des déchets
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <FormLabel className="text-sm text-green-700">Type de collecte</FormLabel>
          <div className="flex flex-wrap gap-2">
            {wasteOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
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
                />
                <label 
                  htmlFor={`waste-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {wasteType !== 'none' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="wasteQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-green-700">Quantité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        setQuantity(value);
                        updateWasteManagement(wasteType, value);
                      }}
                      className="border-green-300 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteManagementSection;
