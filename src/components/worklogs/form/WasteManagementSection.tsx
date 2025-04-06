
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

const WasteManagementSection: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Trash2 className="w-5 h-5 mr-2 text-muted-foreground" />
        Gestion des déchets
      </h3>
      
      <FormField
        control={form.control}
        name="wasteManagement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de collecte</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  
                  <SelectItem value="big_bag_1">1 Big-bag</SelectItem>
                  <SelectItem value="big_bag_2">2 Big-bags</SelectItem>
                  <SelectItem value="big_bag_3">3 Big-bags</SelectItem>
                  <SelectItem value="big_bag_4">4 Big-bags</SelectItem>
                  <SelectItem value="big_bag_5">5 Big-bags</SelectItem>
                  
                  <SelectItem value="half_dumpster_1">1 × 1/2 Benne</SelectItem>
                  <SelectItem value="half_dumpster_2">2 × 1/2 Bennes</SelectItem>
                  <SelectItem value="half_dumpster_3">3 × 1/2 Bennes</SelectItem>
                  
                  <SelectItem value="dumpster_1">1 Benne</SelectItem>
                  <SelectItem value="dumpster_2">2 Bennes</SelectItem>
                  <SelectItem value="dumpster_3">3 Bennes</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default WasteManagementSection;
