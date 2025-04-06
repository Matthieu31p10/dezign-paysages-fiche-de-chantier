
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';

const WasteManagementSection: React.FC = () => {
  const { control } = useFormContext<BlankWorkSheetValues>();
  
  const wasteOptions = {
    "none": "Aucun",
    "big_bag_1": "Big-Bag (1)",
    "big_bag_2": "Big-Bag (2)",
    "big_bag_3": "Big-Bag (3)",
    "big_bag_4": "Big-Bag (4)",
    "big_bag_5": "Big-Bag (5)",
    "half_dumpster_1": "1/2 Benne (1)",
    "half_dumpster_2": "1/2 Benne (2)",
    "half_dumpster_3": "1/2 Benne (3)",
    "dumpster_1": "Benne (1)",
    "dumpster_2": "Benne (2)",
    "dumpster_3": "Benne (3)",
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Truck className="w-5 h-5 mr-2 text-muted-foreground" />
        Gestion des déchets
      </h2>
      
      <FormField
        control={control}
        name="wasteManagement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Évacuation des déchets</FormLabel>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(wasteOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default WasteManagementSection;
