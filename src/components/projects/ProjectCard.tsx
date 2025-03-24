
import { ProjectInfo } from '@/types/models';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Clock, FileText, Home, Landmark, MapPin, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectCardProps {
  project: ProjectInfo;
  onSelect?: (id: string) => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const getProjectTypeColor = () => {
    switch (project.projectType) {
      case 'residence':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'particular':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'enterprise':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      default:
        return '';
    }
  };

  const getProjectTypeIcon = () => {
    switch (project.projectType) {
      case 'residence':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'particular':
        return <Home className="h-4 w-4 text-blue-400" />;
      case 'enterprise':
        return <Landmark className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Non définie';
    return format(new Date(date), 'PPP', { locale: fr });
  };
  
  return (
    <Card className={cn(
      "hover-scale border shadow-sm transition-all",
      getProjectTypeColor(),
      project.isArchived && "opacity-60"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              {getProjectTypeIcon()}
              <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="line-clamp-1">{project.address}</span>
            </div>
          </div>
          
          {project.isArchived && (
            <Badge variant="outline" className="ml-2 bg-gray-100">
              Archivé
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Durée par passage:</span>
            <span className="font-medium">{project.visitDuration}h</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Passages annuels:</span>
            <span className="font-medium">{project.annualVisits}</span>
          </div>
          
          {project.contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-medium">{project.contact.phone}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="text-xs">
              <span className="text-muted-foreground block">Date de début:</span>
              <span className="font-medium">{formatDate(project.startDate)}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground block">Date de fin:</span>
              <span className="font-medium">{formatDate(project.endDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Détails
        </Button>
        
        {onSelect && (
          <Button
            size="sm"
            onClick={() => onSelect(project.id)}
          >
            <User className="h-4 w-4 mr-1" />
            Sélectionner
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
