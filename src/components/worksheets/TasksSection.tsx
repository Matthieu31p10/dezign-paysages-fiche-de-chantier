
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

const TasksSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <CheckSquare className="w-5 h-5 mr-2 text-muted-foreground" />
        Tâches réalisées
      </h2>
      
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
