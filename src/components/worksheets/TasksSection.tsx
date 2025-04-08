import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';

const TasksSection: React.FC = () => {
  // Le composant est gardé pour la structure mais ne contient plus le champ description
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <CheckSquare className="w-5 h-5 mr-2 text-muted-foreground" />
        Tâches réalisées
      </h2>
      
      {/* Section conservée mais sans contenu spécifique */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <p className="text-muted-foreground text-sm">
            Utilisez la section consommables ci-dessous pour détailler les travaux effectués.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksSection;
