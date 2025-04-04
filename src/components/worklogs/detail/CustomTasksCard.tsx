
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useWorkLogDetail } from './WorkLogDetailContext';

const CustomTasksCard: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const { workLog } = useWorkLogDetail();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tâches personnalisées</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {workLog.tasksPerformed.customTasks && Object.entries(workLog.tasksPerformed.customTasks).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(workLog.tasksPerformed.customTasks).map(([taskId, isCompleted]) => {
              if (!isCompleted) return null;
              
              const taskName = settings.customTasks?.find(t => t.id === taskId)?.name || taskId;
              const progress = workLog.tasksPerformed.tasksProgress?.[taskId] || 0;
              
              return (
                <div key={taskId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{taskName}</span>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune tâche personnalisée n'a été réalisée.</p>
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Arrosage</span>
            <Badge variant="outline" className={
              workLog.tasksPerformed.watering === 'none'
                ? 'bg-gray-100 text-gray-800'
                : workLog.tasksPerformed.watering === 'on'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
            }>
              {workLog.tasksPerformed.watering === 'none'
                ? 'Pas d\'arrosage'
                : workLog.tasksPerformed.watering === 'on'
                  ? 'Allumé'
                  : 'Coupé'
              }
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/projects/${workLog.projectId}`)}
        >
          Voir le chantier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomTasksCard;
