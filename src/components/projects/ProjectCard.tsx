
import { ProjectInfo } from '@/types/models';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Clock, FileText, Home, Landmark, MapPin, Phone, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectCardProps {
  project: ProjectInfo;
  onSelect?: (id: string) => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const getProjectTypeConfig = () => {
    switch (project.projectType) {
      case 'residence':
        return { 
          bg: 'bg-gradient-to-br from-green-50 via-green-25 to-white border-green-200/50 hover:border-green-300', 
          icon: <Building2 className="h-5 w-5 text-green-600" />,
          badge: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'particular':
        return { 
          bg: 'bg-gradient-to-br from-blue-50 via-blue-25 to-white border-blue-200/50 hover:border-blue-300', 
          icon: <Home className="h-5 w-5 text-blue-600" />,
          badge: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'enterprise':
        return { 
          bg: 'bg-gradient-to-br from-orange-50 via-orange-25 to-white border-orange-200/50 hover:border-orange-300', 
          icon: <Landmark className="h-5 w-5 text-orange-600" />,
          badge: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      default:
        return { 
          bg: 'bg-gradient-to-br from-gray-50 to-white border-gray-200/50', 
          icon: <FileText className="h-5 w-5 text-gray-500" />,
          badge: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Non définie';
    return format(new Date(date), 'PPP', { locale: fr });
  };

  const typeConfig = getProjectTypeConfig();
  
  return (
    <Card className={cn(
      "group transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border-2 cursor-pointer",
      typeConfig.bg,
      project.isArchived && "opacity-60 grayscale"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                {typeConfig.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg line-clamp-1 text-gray-900 group-hover:text-gray-700 transition-colors">
                  {project.name}
                </h3>
                <Badge variant="outline" className={`text-xs ${typeConfig.badge}`}>
                  {project.projectType === 'residence' ? 'Résidence' : 
                   project.projectType === 'particular' ? 'Particulier' : 'Entreprise'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">{project.address}</span>
            </div>
          </div>
          
          {project.isArchived && (
            <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-600 border-gray-300">
              Archivé
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <span className="text-gray-500 text-xs block">Durée/passage</span>
              <span className="font-semibold text-gray-900">{project.visitDuration}h</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <span className="text-gray-500 text-xs block">Passages/an</span>
              <span className="font-semibold text-gray-900">{project.annualVisits}</span>
            </div>
          </div>
          
          {project.contact.phone && (
            <div className="col-span-2 flex items-center gap-2 p-3 bg-white/60 rounded-lg">
              <Phone className="h-4 w-4 text-purple-500" />
              <div>
                <span className="text-gray-500 text-xs block">Contact</span>
                <span className="font-semibold text-gray-900">{project.contact.phone}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/projects/${project.id}`)}
          className="flex-1 group/btn hover:bg-white hover:border-gray-300 transition-all duration-200"
        >
          Détails
          <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
        
        {onSelect && (
          <Button
            size="sm"
            onClick={() => onSelect(project.id)}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200"
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
