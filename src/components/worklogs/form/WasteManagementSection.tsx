
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Trash2 className="w-5 h-5 mr-2 text-muted-foreground" />
        Gestion des déchets
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="wasteType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de collecte</FormLabel>
              <FormControl>
                <Select 
                  value={wasteType}
                  onValueChange={(value) => {
                    setWasteType(value);
                    updateWasteManagement(value, quantity);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="big_bag">Big-bag</SelectItem>
                    <SelectItem value="half_dumpster">1/2 Benne</SelectItem>
                    <SelectItem value="dumpster">Benne</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {wasteType !== 'none' && (
          <FormField
            control={form.control}
            name="wasteQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Select 
                    value={quantity}
                    onValueChange={(value) => {
                      setQuantity(value);
                      updateWasteManagement(wasteType, value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Quantité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default WasteManagementSection;
