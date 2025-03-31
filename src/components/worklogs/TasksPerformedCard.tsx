
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface TasksPerformedCardProps {
  tasksPerformed: {
    mowing: boolean;
    brushcutting: boolean;
    blower: boolean;
    manualWeeding: boolean;
    whiteVinegar: boolean;
    pruning: {
      done: boolean;
      progress: number;
    };
    watering: 'none' | 'on' | 'off';
  };
  projectId: string;
  navigateToProject: (id: string) => void;
}

const TasksPerformedCard = ({ tasksPerformed, projectId, navigateToProject }: TasksPerformedCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Travaux effectués</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Tonte</span>
            {tasksPerformed.mowing ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Débroussailleuse</span>
            {tasksPerformed.brushcutting ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Souffleur</span>
            {tasksPerformed.blower ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Désherbage manuel</span>
            {tasksPerformed.manualWeeding ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Vinaigre blanc</span>
            {tasksPerformed.whiteVinegar ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Taille</span>
            {tasksPerformed.pruning.done ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-300" />
            )}
          </div>
          
          {tasksPerformed.pruning.done && (
            <div className="pl-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avancement</span>
                <span className="text-sm font-medium">
                  {tasksPerformed.pruning.progress}%
                </span>
              </div>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-brand-500 h-1.5 rounded-full"
                    style={{ width: `${tasksPerformed.pruning.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Arrosage</span>
            <Badge variant="outline" className={
              tasksPerformed.watering === 'none'
                ? 'bg-gray-100 text-gray-800'
                : tasksPerformed.watering === 'on'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
            }>
              {tasksPerformed.watering === 'none'
                ? 'Pas d\'arrosage'
                : tasksPerformed.watering === 'on'
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
          onClick={() => navigateToProject(projectId)}
        >
          Voir le chantier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TasksPerformedCard;
