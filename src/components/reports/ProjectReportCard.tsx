
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building2, Clock, Home, Landmark, Users, Calendar, Timer, AlertCircle } from 'lucide-react';
import { calculateAverageHoursPerVisit, getDaysSinceLastEntry } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProjectReportCardProps {
  project: ProjectInfo;
  workLogs: WorkLog[];
  teamName?: string;
}

const ProjectReportCard = ({ project, workLogs, teamName }: ProjectReportCardProps) => {
  // Calculate progress metrics
  const visitsCompleted = workLogs.length;
  const visitProgress = project.annualVisits > 0 
    ? Math.min(100, Math.round((visitsCompleted / project.annualVisits) * 100))
    : 0;
  
  const totalHours = workLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
  const hoursProgress = project.annualTotalHours > 0
    ? Math.min(100, Math.round((totalHours / project.annualTotalHours) * 100))
    : 0;
  
  const daysSinceLastVisit = getDaysSinceLastEntry(workLogs);
  
  // Fixed: Calculate average hours per visit with correct arguments
  const averageHoursPerVisit = calculateAverageHoursPerVisit(
    totalHours, 
    workLogs.length
  );
  
  // Calculate remaining hours and visits
  const remainingVisits = Math.max(0, project.annualVisits - visitsCompleted);
  const remainingHours = Math.max(0, project.annualTotalHours - totalHours);
  const averageHoursPerRemainingVisit = remainingVisits > 0 
    ? remainingHours / remainingVisits 
    : 0;
  
  // Calculate time deviation
  const calculateTimeDeviation = () => {
    if (workLogs.length === 0) {
      return { value: 0, display: "N/A", className: "" };
    }
    
    const difference = project.visitDuration - averageHoursPerVisit;
    const display = `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} h`;
    const className = difference >= 0 
      ? 'text-green-600' 
      : 'text-red-600';
      
    return { value: difference, display, className };
  };
  
  const timeDeviation = calculateTimeDeviation();
  
  const getProjectTypeIcon = () => {
    switch (project.projectType) {
      case 'residence':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'particular':
        return <Home className="h-4 w-4 text-blue-400" />;
      case 'enterprise':
        return <Landmark className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };
  
  const getProjectTypeColor = () => {
    switch (project.projectType) {
      case 'residence':
        return 'bg-green-50 border-green-200';
      case 'particular':
        return 'bg-blue-50 border-blue-200';
      case 'enterprise':
        return 'bg-orange-50 border-orange-200';
      default:
        return '';
    }
  };
  
  return (
    <Card className={cn(
      "border shadow-sm hover:shadow-md transition-shadow", 
      getProjectTypeColor()
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {getProjectTypeIcon()}
            <h3 className="font-semibold text-base">{project.name}</h3>
          </div>
          {teamName && (
            <Badge variant="outline" className="bg-slate-50">
              <Users className="h-3 w-3 mr-1" />
              {teamName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Passages effectués:</span>
              <span className="font-medium">{visitsCompleted} / {project.annualVisits}</span>
            </div>
            <Progress value={visitProgress} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Heures utilisées:</span>
              <span className="font-medium">{totalHours.toFixed(1)} / {project.annualTotalHours}</span>
            </div>
            <Progress value={hoursProgress} className="h-2" />
          </div>
          
          <div className="pt-2 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Temps moyen / passage:</span>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="font-medium text-sm">{averageHoursPerVisit.toFixed(1)} h</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Dernier passage il y a:</span>
              <div className="font-medium text-sm">
                {daysSinceLastVisit !== null 
                  ? `${daysSinceLastVisit} jour${daysSinceLastVisit > 1 ? 's' : ''}`
                  : 'Aucun passage'}
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Écart du temps:</span>
              <div className="flex items-center">
                <AlertCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className={`font-medium text-sm ${timeDeviation.className}`}>
                  {timeDeviation.display}
                </span>
              </div>
            </div>
            
            {remainingVisits > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">H. restantes / passage:</span>
                <div className="flex items-center">
                  <Timer className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    {averageHoursPerRemainingVisit.toFixed(1)} h
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectReportCard;
