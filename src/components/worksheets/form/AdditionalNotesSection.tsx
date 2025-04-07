
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const AdditionalNotesSection: React.FC = () => {
  const { control } = useFormContext<BlankWorkSheetValues>();
  
  return (
    <FormField
      control={control}
      name="workDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes supplémentaires</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Informations complémentaires..." 
              className="min-h-24" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdditionalNotesSection;
