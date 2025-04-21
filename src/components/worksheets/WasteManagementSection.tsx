
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
import { Trash2 } from 'lucide-react';

const WasteManagementSection = () => {
  const { control, register, watch } = useFormContext();
  const wasteManagement = watch('wasteManagement');
  
  return (
    <Card className="border-amber-200">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="text-amber-800 flex items-center text-base">
          <Trash2 className="h-4 w-4 mr-2 text-amber-600" />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Aucun déchet</SelectItem>
                    <SelectItem value="greenWaste">Déchets verts</SelectItem>
                    <SelectItem value="mixedWaste">Déchets mixtes</SelectItem>
                    <SelectItem value="rubble">Gravats</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {wasteManagement && wasteManagement !== 'none' && (
            <FormItem>
              <FormLabel>Quantité (m³)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Volume en m³"
                  {...register('wasteQuantity')}
                />
              </FormControl>
              <FormDescription>
                Estimation du volume en mètres cubes
              </FormDescription>
            </FormItem>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WasteManagementSection;
