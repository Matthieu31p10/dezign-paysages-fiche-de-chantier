import React, { useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  Home, 
  Landmark, 
  MapPin, 
  Phone, 
  User, 
  ArrowRight, 
  Users,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnhancedProjectCardProps {
  project: ProjectInfo;
  onSelect?: (id: string) => void;
  totalPersonnel?: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  showSelectionMode?: boolean;
  animationDelay?: number;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ 
  project, 
  onSelect, 
  totalPersonnel = 0,
  isSelected = false,
  onSelectionChange,
  showSelectionMode = false,
  animationDelay = 0
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [animationClass, setAnimationClass] = useState('opacity-0 translate-y-4');
  
  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('opacity-100 translate-y-0');
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);
  
  const getProjectTypeConfig = () => {
    switch (project.projectType) {
      case 'residence':
        return { 
          bg: 'bg-gradient-to-br from-green-50 via-green-25 to-white', 
          border: isSelected ? 'border-green-400 shadow-green-200' : 'border-green-200/50 hover:border-green-300',
          glow: 'hover:shadow-green-100',
          icon: <Building2 className="h-5 w-5 text-green-600" />,
          badge: 'bg-green-100 text-green-700 border-green-200',
          accent: 'text-green-600'
        };
      case 'particular':
        return { 
          bg: 'bg-gradient-to-br from-blue-50 via-blue-25 to-white', 
          border: isSelected ? 'border-blue-400 shadow-blue-200' : 'border-blue-200/50 hover:border-blue-300',
          glow: 'hover:shadow-blue-100',
          icon: <Home className="h-5 w-5 text-blue-600" />,
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          accent: 'text-blue-600'
        };
      case 'enterprise':
        return { 
          bg: 'bg-gradient-to-br from-orange-50 via-orange-25 to-white', 
          border: isSelected ? 'border-orange-400 shadow-orange-200' : 'border-orange-200/50 hover:border-orange-300',
          glow: 'hover:shadow-orange-100',
          icon: <Landmark className="h-5 w-5 text-orange-600" />,
          badge: 'bg-orange-100 text-orange-700 border-orange-200',
          accent: 'text-orange-600'
        };
      default:
        return { 
          bg: 'bg-gradient-to-br from-gray-50 to-white', 
          border: isSelected ? 'border-gray-400 shadow-gray-200' : 'border-gray-200/50 hover:border-gray-300',
          glow: 'hover:shadow-gray-100',
          icon: <FileText className="h-5 w-5 text-gray-500" />,
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          accent: 'text-gray-600'
        };
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Non définie';
    return format(new Date(date), 'PPP', { locale: fr });
  };

  const typeConfig = getProjectTypeConfig();
  
  return (
    <Card 
      className={cn(
        "group relative transition-all duration-500 transform cursor-pointer border-2 overflow-hidden",
        typeConfig.bg,
        typeConfig.border,
        typeConfig.glow,
        animationClass,
        isHovered && "scale-[1.02] shadow-2xl",
        isSelected && "ring-2 ring-offset-2",
        project.isArchived && "opacity-60 grayscale-[0.3]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Chantier ${project.name}`}
    >
      {/* Effet de brillance animé */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
        "transform -translate-x-full transition-transform duration-1000",
        isHovered && "translate-x-full"
      )} />

      {/* Sélection mode */}
      {showSelectionMode && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange?.(project.id, !!checked)}
            className="border-2 bg-white/90 backdrop-blur"
          />
        </div>
      )}

      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-3 bg-white/80 backdrop-blur rounded-xl shadow-sm transition-all duration-300",
                isHovered && "shadow-md scale-110"
              )}>
                {typeConfig.icon}
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "font-bold text-lg line-clamp-1 transition-all duration-300",
                  typeConfig.accent,
                  isHovered && "translate-x-1"
                )}>
                  {project.name}
                </h3>
                <Badge variant="outline" className={`text-xs ${typeConfig.badge} animate-fade-in`}>
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
            <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-600 border-gray-300 animate-pulse">
              Archivé
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 relative">
        {/* Statistiques en grille */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={cn(
            "flex items-center gap-2 p-3 bg-white/60 backdrop-blur rounded-lg transition-all duration-300",
            isHovered && "bg-white/80 shadow-sm"
          )}>
            <Users className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-xs text-gray-500">Équipe</div>
              <div className="font-semibold text-sm">{totalPersonnel} membre{totalPersonnel > 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 p-3 bg-white/60 backdrop-blur rounded-lg transition-all duration-300",
            isHovered && "bg-white/80 shadow-sm"
          )}>
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-xs text-gray-500">Heures/an</div>
              <div className="font-semibold text-sm">{project.annualTotalHours || 0}h</div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 p-3 bg-white/60 backdrop-blur rounded-lg transition-all duration-300",
            isHovered && "bg-white/80 shadow-sm"
          )}>
            <Calendar className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-xs text-gray-500">Visites/an</div>
              <div className="font-semibold text-sm">{project.annualVisits || 0}</div>
            </div>
          </div>
          
          {project.contactPhone && (
            <div className={cn(
              "flex items-center gap-2 p-3 bg-white/60 backdrop-blur rounded-lg transition-all duration-300",
              isHovered && "bg-white/80 shadow-sm"
            )}>
              <Phone className="h-4 w-4 text-indigo-500" />
              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div className="font-semibold text-xs truncate">{project.contactPhone}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Actions avec animations */}
      <div className={cn(
        "flex justify-between gap-3 px-6 pb-6 transition-all duration-300",
        isHovered && "translate-y-0 opacity-100",
        !isHovered && "translate-y-1 opacity-90"
      )}>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}`);
          }}
          className={cn(
            "flex-1 transition-all duration-300 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md group/btn",
            typeConfig.border.includes('green') && "hover:border-green-300 hover:text-green-700",
            typeConfig.border.includes('blue') && "hover:border-blue-300 hover:text-blue-700",
            typeConfig.border.includes('orange') && "hover:border-orange-300 hover:text-orange-700"
          )}
        >
          <Eye className="h-4 w-4 mr-1" />
          Détails
          <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
        
        {onSelect && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project.id);
            }}
            className={cn(
              "flex-1 transition-all duration-300 shadow-md hover:shadow-lg group/btn",
              "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            )}
          >
            <User className="h-4 w-4 mr-1" />
            Sélectionner
          </Button>
        )}
      </div>

      {/* Indicateur de statut */}
      <div className={cn(
        "absolute top-0 right-0 w-2 h-full transition-all duration-300",
        !project.isArchived ? typeConfig.accent.replace('text-', 'bg-') : 'bg-gray-300',
        isSelected && "w-3"
      )} />
    </Card>
  );
};

export default EnhancedProjectCard;