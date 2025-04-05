
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const WasteManagementSection = () => {
  const form = useFormContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des déchets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wasteManagement.wasteTaken"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Déchets emportés
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="wasteManagement.wasteLeft"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Déchets laissés sur place
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="wasteManagement.wasteDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Détails sur les déchets</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Détails sur les déchets..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default WasteManagementSection;
