
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ProjectInfo } from '@/types/models';
import { Phone, Mail, Users, Calendar, Clock, FileText, Building, Tag } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import ProjectProgressCard from './ProjectProgressCard';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailsTabProps {
  project: ProjectInfo;
  teamName: string;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project, teamName }) => {
  const { getTotalVisits, getWorkLogsByProjectId } = useWorkLogs();
  
  // Calculate remaining hours
  const workLogs = getWorkLogsByProjectId(project.id);
  const totalVisits = getTotalVisits(project.id);
  const totalHoursUsed = workLogs.reduce((total, log) => total + (log.timeTracking?.totalHours || 0), 0);
  const annualRemainingHours = Math.max(0, project.annualTotalHours - totalHoursUsed);
  
  // Get project type label
  const getProjectTypeLabel = (type: string): string => {
    switch (type) {
      case 'residence': return 'Résidence';
      case 'particular': return 'Particulier';
      case 'enterprise': return 'Entreprise';
      default: return 'Non spécifié';
    }
  };
  
  // Get irrigation type label
  const getIrrigationLabel = (irrigation?: string): string => {
    switch (irrigation) {
      case 'irrigation': return 'Active';
      case 'disabled': return 'Désactivée';
      case 'none': return 'Aucune';
      default: return 'Non spécifiée';
    }
  };
  
  // Get mower type label
  const getMowerTypeLabel = (type?: string): string => {
    switch (type) {
      case 'large': return 'Grande';
      case 'small': return 'Petite';
      case 'both': return 'Les deux';
      default: return 'Non spécifié';
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-green-100">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-lg text-green-800">Informations générales</CardTitle>
            <CardDescription>Détails principaux du chantier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div>
              <div className="flex items-center mb-4">
                <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
                  <Building className="w-3.5 h-3.5 mr-1" />
                  {getProjectTypeLabel(project.projectType)}
                </Badge>
                
                {project.irrigation && (
                  <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                    <Tag className="w-3.5 h-3.5 mr-1" />
                    Irrigation: {getIrrigationLabel(project.irrigation)}
                  </Badge>
                )}
                
                {project.mowerType && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Tag className="w-3.5 h-3.5 mr-1" />
                    Tondeuse: {getMowerTypeLabel(project.mowerType)}
                  </Badge>
                )}
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                    <div className="mt-1 space-y-1">
                      {project.contact.phone && (
                        <p className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {project.contact.phone}
                        </p>
                      )}
                      {project.contact.email && (
                        <p className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          {project.contact.email}
                        </p>
                      )}
                      {!project.contact.phone && !project.contact.email && (
                        <p className="text-sm text-muted-foreground">Aucune information de contact</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Équipe responsable</h3>
                    <p className="mt-1 flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      {teamName}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                    <p className="mt-1 text-sm whitespace-pre-line">
                      {project.address || "Aucune adresse spécifiée"}
                    </p>
                  </div>
                  
                  {project.contact.name && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nom du contact</h3>
                      <p className="mt-1 text-sm">
                        {project.contact.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator className="bg-green-100" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-green-700">Informations de planification</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border border-green-100 rounded-md bg-green-50">
                    <p className="text-xs text-green-600 mb-1">Passages par an</p>
                    <p className="flex items-center text-sm font-medium">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      {project.annualVisits}
                    </p>
                  </div>
                  
                  <div className="p-3 border border-green-100 rounded-md bg-green-50">
                    <p className="text-xs text-green-600 mb-1">Heures par passage</p>
                    <p className="flex items-center text-sm font-medium">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      {formatNumber(project.visitDuration)}
                    </p>
                  </div>
                  
                  <div className="p-3 border border-green-100 rounded-md bg-green-50">
                    <p className="text-xs text-green-600 mb-1">Heures totales par an</p>
                    <p className="flex items-center text-sm font-medium">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      {formatNumber(project.annualTotalHours)}
                    </p>
                  </div>
                  
                  <div className="p-3 border border-green-100 rounded-md bg-green-50">
                    <p className="text-xs text-green-600 mb-1">Heures restantes</p>
                    <p className="flex items-center text-sm font-medium">
                      <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                      {formatNumber(annualRemainingHours)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Informations du contrat</h3>
                <div className="mt-1">
                  <p className="text-sm whitespace-pre-line">
                    {project.contract.details || "Aucune information sur le contrat"}
                  </p>
                  
                  {project.contract.documentUrl && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.contract.documentUrl} target="_blank" rel="noopener noreferrer">
                          <File className="w-4 h-4 mr-2" />
                          Voir le document
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">
              {project.additionalInfo || "Aucune information complémentaire"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <ProjectProgressCard project={project} />
        
        <Card className="border-green-100">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-sm text-green-700">Suivi des heures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Visites effectuées</span>
                <span className="font-medium">{totalVisits} / {project.annualVisits}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Heures utilisées</span>
                <span className="font-medium">{formatNumber(totalHoursUsed)} / {formatNumber(project.annualTotalHours)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Heures restantes</span>
                <span className="font-medium text-emerald-600">{formatNumber(annualRemainingHours)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailsTab;
