
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';

const TasksSection: React.FC = () => {
  const { control } = useFormContext<BlankWorkSheetValues>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <CheckSquare className="w-5 h-5 mr-2 text-muted-foreground" />
        Tâches réalisées
      </h2>
      
      <Card>
        <CardContent className="pt-4 space-y-4">
          <FormField
            control={control}
            name="workDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description des travaux</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez les travaux effectués..." 
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksSection;
