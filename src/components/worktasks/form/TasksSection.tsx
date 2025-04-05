
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const TasksSection = () => {
  const { settings } = useApp();
  const form = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tâches personnalisées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.customTasks?.length === 0 ? (
          <p className="text-muted-foreground">
            Aucune tâche personnalisée définie. Ajoutez-en dans les paramètres.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.customTasks?.map((task) => (
              <div key={task.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <FormField
                    control={form.control}
                    name={`tasksPerformed.customTasks.${task.id}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-medium">
                          {task.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`tasksPerformed.tasksProgress.${task.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progression (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
