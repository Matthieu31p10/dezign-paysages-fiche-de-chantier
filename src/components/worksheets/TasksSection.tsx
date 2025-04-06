
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { BlankWorkSheetValues } from './schema';

const TasksSection: React.FC = () => {
  const { control } = useFormContext<BlankWorkSheetValues>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Tâches réalisées</h2>
      
      <Card>
        <CardContent className="pt-4">
          <p className="text-muted-foreground mb-4">
            Personnaliser les tâches dans le champ "Description des travaux".
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksSection;
