
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateAnnualProgress, formatNumber } from '@/utils/helpers';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { BarChart3, Calendar, Users, Clock, MapPin, Phone, Mail, FileText, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: ProjectInfo;
  onSelect: (id: string) => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { getWorkLogsByProjectId, teams } = useApp();
  const workLogs = getWorkLogsByProjectId(project.id);
  
  const teamName = teams.find(team => team.id === project.team)?.name || 'Équipe non assignée';
  
  const totalCompletedHours = workLogs.reduce((total, log) => total + log.timeTracking.totalHours, 0);
  const percentageComplete = calculateAnnualProgress(workLogs, project.annualVisits);
  
  // Calculate time remaining
  const remainingVisits = Math.max(0, project.annualVisits - workLogs.length);
  const remainingHours = Math.max(0, project.annualTotalHours - totalCompletedHours);

  return (
    <Card className="hover-scale border shadow-sm overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-brand-50 text-brand-700 hover:bg-brand-100">
              {teamName}
            </Badge>
            <CardTitle className="text-xl font-medium">{project.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-500" />
              {project.address}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {/* Contact info */}
          {(project.contact.phone || project.contact.email) && (
            <div className="space-y-1">
              {project.contact.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="w-3.5 h-3.5 mr-2 text-brand-600" />
                  <span>{project.contact.phone}</span>
                </div>
              )}
              {project.contact.email && (
                <div className="flex items-center text-sm">
                  <Mail className="w-3.5 h-3.5 mr-2 text-brand-600" />
                  <span>{project.contact.email}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Progress section */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium">Progression annuelle</div>
              <div className="text-sm font-medium">{percentageComplete}%</div>
            </div>
            <Progress value={percentageComplete} className="h-2" />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center text-sm">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                <span>
                  {workLogs.length}/{project.annualVisits} passages
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                <span>
                  {formatNumber(totalCompletedHours)}/{formatNumber(project.annualTotalHours)} h
                </span>
              </div>
            </div>
          </div>
          
          {/* Brief summary */}
          <div className="text-sm">
            <div className="flex items-start">
              <Info className="w-3.5 h-3.5 mr-1.5 text-brand-600 mt-0.5 flex-shrink-0" />
              <div className="line-clamp-3">
                {project.additionalInfo || "Aucune information complémentaire"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 gap-2 flex flex-col sm:flex-row sm:justify-end">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Détails
        </Button>
        <Button 
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => onSelect(project.id)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Suivi
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
