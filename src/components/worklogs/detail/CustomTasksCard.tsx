
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkLogDetail } from './WorkLogDetailContext';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, CircleSlash } from 'lucide-react';

const CustomTasksCard: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  const { settings } = useApp();
  
  // Sécurité: initialise les objets s'ils n'existent pas
  const customTasks = workLog?.tasksPerformed?.customTasks || {};
  const tasksProgress = workLog?.tasksPerformed?.tasksProgress || {};
  const customTasksList = settings?.customTasks || [];

  // Filtrer pour n'afficher que les tâches actives dans le worklog
  const activeTasks = Object.keys(customTasks).filter(
    taskId => customTasks[taskId]
  );

  const getTaskName = (taskId: string) => {
    const task = customTasksList.find(task => task.id === taskId);
    return task?.name || 'Tâche inconnue';
  };

  const getTaskProgress = (taskId: string) => {
    return tasksProgress[taskId] || 0;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-500">
          Tâches personnalisées
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTasks.length > 0 ? (
          <div className="space-y-4">
            {activeTasks.map(taskId => (
              <div key={taskId} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate max-w-[70%]">
                    {getTaskName(taskId)}
                  </span>
                  <Badge variant="outline" className="bg-brand-50 text-brand-700">
                    {getTaskProgress(taskId)}%
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ 
                      width: `${Math.min(100, getTaskProgress(taskId))}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <CircleSlash className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune tâche personnalisée effectuée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomTasksCard;
