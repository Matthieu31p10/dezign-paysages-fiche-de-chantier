
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { ProjectInfo, WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';

interface ProjectProgressCardProps {
  project: ProjectInfo;
}

const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { workLogs } = useApp();
  
  // Filtrer les fiches de suivi pour ce projet
  const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
  
  const totalCompletedHours = projectWorkLogs.reduce((total, log) => {
    return total + (log.timeTracking?.totalHours || 0);
  }, 0);
  
  const completedVisits = projectWorkLogs.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progression</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Passages effectués</span>
            <span className="text-sm font-medium">
              {completedVisits} / {project.annualVisits}
            </span>
          </div>
          <progress 
            className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
            value={completedVisits} 
            max={project.annualVisits}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Heures effectuées</span>
            <span className="text-sm font-medium">
              {formatNumber(totalCompletedHours)} / {formatNumber(project.annualTotalHours)}
            </span>
          </div>
          <progress 
            className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
            value={totalCompletedHours} 
            max={project.annualTotalHours}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Reste à effectuer</h3>
          <div className="text-sm">
            <p>
              <span className="font-medium">{project.annualVisits - completedVisits}</span> passages
            </p>
            <p>
              <span className="font-medium">{formatNumber(project.annualTotalHours - totalCompletedHours)}</span> heures
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Nouvelle fiche de suivi
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectProgressCard;
