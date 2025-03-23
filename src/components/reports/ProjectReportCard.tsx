
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatNumber, calculateAnnualProgress } from '@/utils/helpers';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { BarChart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectReportCardProps {
  project: ProjectInfo;
  workLogs: WorkLog[];
}

const ProjectReportCard = ({ project, workLogs }: ProjectReportCardProps) => {
  const navigate = useNavigate();
  
  const totalCompletedHours = workLogs.reduce((total, log) => total + log.timeTracking.totalHours, 0);
  const percentageComplete = calculateAnnualProgress(workLogs, project.annualVisits);
  
  // Calculate time remaining
  const remainingVisits = Math.max(0, project.annualVisits - workLogs.length);
  const remainingHours = Math.max(0, project.annualTotalHours - totalCompletedHours);
  
  // Calculate efficiency compared to planned duration
  const plannedHours = workLogs.length * project.visitDuration;
  const efficiency = plannedHours > 0 ? Math.round((plannedHours / totalCompletedHours) * 100) : 0;
  
  // Tasks statistics
  const taskStats = {
    mowing: workLogs.filter(log => log.tasksPerformed.mowing).length,
    brushcutting: workLogs.filter(log => log.tasksPerformed.brushcutting).length,
    blower: workLogs.filter(log => log.tasksPerformed.blower).length,
    manualWeeding: workLogs.filter(log => log.tasksPerformed.manualWeeding).length,
    whiteVinegar: workLogs.filter(log => log.tasksPerformed.whiteVinegar).length,
    pruning: workLogs.filter(log => log.tasksPerformed.pruning.done).length,
  };
  
  // Get the most frequent task
  const mostFrequentTask = Object.entries(taskStats)
    .sort((a, b) => b[1] - a[1])[0];
    
  // Find most recent pruning progress
  const pruningLogs = workLogs
    .filter(log => log.tasksPerformed.pruning.done)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestPruningProgress = pruningLogs.length > 0 
    ? pruningLogs[0].tasksPerformed.pruning.progress 
    : 0;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-medium truncate">{project.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {project.address}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium">Progression annuelle</div>
            <div className="text-sm font-medium">{percentageComplete}%</div>
          </div>
          <Progress value={percentageComplete} className="h-2" />
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="flex justify-between">
              <span>Passages:</span>
              <span className="font-medium">{workLogs.length}/{project.annualVisits}</span>
            </div>
            <div className="flex justify-between">
              <span>Heures:</span>
              <span className="font-medium">{formatNumber(totalCompletedHours)}/{formatNumber(project.annualTotalHours)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium">Activités principales</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {mostFrequentTask && mostFrequentTask[1] > 0 && (
              <Badge variant="secondary">
                {mostFrequentTask[0] === 'mowing' ? 'Tonte' : 
                 mostFrequentTask[0] === 'brushcutting' ? 'Débroussaillage' :
                 mostFrequentTask[0] === 'blower' ? 'Souffleur' :
                 mostFrequentTask[0] === 'manualWeeding' ? 'Désherbage' :
                 mostFrequentTask[0] === 'whiteVinegar' ? 'Vinaigre' :
                 'Taille'}: {mostFrequentTask[1]}
              </Badge>
            )}
            
            {pruningLogs.length > 0 && (
              <Badge variant="secondary">
                Taille: {latestPruningProgress}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium">Reste à effectuer</div>
          <div className="grid grid-cols-1 gap-1 mt-1 text-sm">
            <div>
              <span className="inline-block w-28">Passages:</span>
              <span className="font-medium">{remainingVisits}</span>
            </div>
            <div>
              <span className="inline-block w-28">Heures:</span>
              <span className="font-medium">{formatNumber(remainingHours)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Button 
          size="sm"
          className="w-full"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Détails du chantier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectReportCard;
