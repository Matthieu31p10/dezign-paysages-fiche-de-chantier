
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { Checkbox } from '@/components/ui/checkbox';

const TasksSection: React.FC = () => {
  const { control, watch } = useFormContext<BlankWorkSheetValues>();
  
  // Standard task types that can be selected
  const standardTasks = [
    { id: "mowing", label: "Tonte" },
    { id: "brushcutting", label: "Débroussaillage" },
    { id: "blower", label: "Souffleur" },
    { id: "manualWeeding", label: "Désherbage manuel" },
    { id: "whiteVinegar", label: "Vinaigre blanc" },
    { id: "pruning", label: "Taille" }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <CheckSquare className="w-5 h-5 mr-2 text-muted-foreground" />
        Tâches réalisées
      </h2>
      
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {standardTasks.map((task) => (
              <FormField
                key={task.id}
                control={control}
                name={`customTasks.${task.id}` as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-accent">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean | undefined}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {task.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          
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
