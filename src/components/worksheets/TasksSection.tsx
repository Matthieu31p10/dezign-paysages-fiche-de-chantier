
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from './schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CustomTask } from '@/types/models';

interface TasksSectionProps {
  customTasks?: CustomTask[];
}

const TasksSection: React.FC<TasksSectionProps> = ({ customTasks = [] }) => {
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
            name="tasks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Détaillez ici les tâches réalisées..." 
                    className="min-h-32"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
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
