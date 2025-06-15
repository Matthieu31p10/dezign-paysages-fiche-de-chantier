
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, Clock, Phone, Mail, User, FileText, MapPin, Wrench, Scissors, Info } from 'lucide-react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/utils/helpers';

interface ProjectDetailsTabProps {
  project: ProjectInfo;
  teamName: string;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project, teamName }) => {
  const { workLogs } = useApp();
  
  // Filter work logs for this project
  const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
  
  // Calculate progress metrics using team hours
  const visitsCompleted = projectWorkLogs.length;
  const visitProgress = project.annualVisits > 0 
    ? Math.min(100, Math.round((visitsCompleted / project.annualVisits) * 100))
    : 0;
  
  // Calculate total team hours instead of individual hours
  const totalTeamHours = projectWorkLogs.reduce((sum, log) => {
    const individualHours = log.timeTracking?.totalHours || 0;
    const personnelCount = log.personnel?.length || 1;
    return sum + (individualHours * personnelCount);
  }, 0);
  
  const hoursProgress = project.annualTotalHours > 0
    ? Math.min(100, Math.round((totalTeamHours / project.annualTotalHours) * 100))
    : 0;

  const getProjectTypeDisplay = (type: string) => {
    switch (type) {
      case 'residence':
        return 'Résidence';
      case 'particular':
        return 'Particulier';
      case 'enterprise':
        return 'Entreprise';
      default:
        return type;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-green-600" />
            Avancement du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Passages effectués</span>
              <span className="text-sm text-muted-foreground">{visitsCompleted} / {project.annualVisits}</span>
            </div>
            <Progress value={visitProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{visitProgress}% des passages annuels</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Heures effectuées (équipe)</span>
              <span className="text-sm text-muted-foreground">{totalTeamHours.toFixed(1)} / {project.annualTotalHours}</span>
            </div>
            <Progress value={hoursProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{hoursProgress}% des heures annuelles</p>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-5 h-5 mr-2 text-green-600" />
            Détails du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Type:</span>
              <span className="text-sm">{getProjectTypeDisplay(project.projectType)}</span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Équipe:</span>
              <span className="text-sm">{teamName}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Début:</span>
              <span className="text-sm">{project.startDate ? formatDate(project.startDate) : 'Non défini'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Fin:</span>
              <span className="text-sm">{project.endDate ? formatDate(project.endDate) : 'Non défini'}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Durée par passage:</span>
              <span className="text-sm">{project.visitDuration} heures</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-green-600" />
            Informations client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start">
            <User className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-sm font-medium">Client:</span>
              <p className="text-sm">{project.clientName || 'Non renseigné'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-sm font-medium">Adresse:</span>
              <p className="text-sm">{project.address}</p>
            </div>
          </div>
          
          {project.contact?.name && (
            <div className="flex items-start">
              <User className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-sm font-medium">Contact:</span>
                <p className="text-sm">{project.contact.name}</p>
              </div>
            </div>
          )}
          
          {project.contact?.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{project.contact.phone}</span>
            </div>
          )}
          
          {project.contact?.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{project.contact.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Site Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-green-600" />
            Détails du site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center">
            <Scissors className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium mr-2">Type de tondeuse:</span>
            <span className="text-sm">{project.mowerType || 'Non spécifié'}</span>
          </div>
          
          <div className="flex items-start">
            <Wrench className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-sm font-medium">Irrigation:</span>
              <p className="text-sm">{project.irrigation || 'Non spécifié'}</p>
            </div>
          </div>
          
          {project.additionalInfo && (
            <div className="flex items-start">
              <Info className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-sm font-medium">Informations additionnelles:</span>
                <p className="text-sm">{project.additionalInfo}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Information */}
      {project.contract?.details && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Détails du contrat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{project.contract.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectDetailsTab;
