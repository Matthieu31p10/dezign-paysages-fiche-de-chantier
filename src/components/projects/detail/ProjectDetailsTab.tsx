
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ProjectInfo } from '@/types/models';
import { Phone, Mail, Users, Calendar, Clock } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';

interface ProjectDetailsTabProps {
  project: ProjectInfo;
  teamName: string;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project, teamName }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails du chantier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informations de planification</h3>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      {project.annualVisits} passages par an
                    </p>
                    <p className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      {formatNumber(project.visitDuration)} heures par passage
                    </p>
                    <p className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      {formatNumber(project.annualTotalHours)} heures totales par an
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
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
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informations complémentaires</h3>
                  <p className="mt-1 text-sm whitespace-pre-line">
                    {project.additionalInfo || "Aucune information complémentaire"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <ProjectProgressCard project={project} />
      </div>
    </div>
  );
};

// We'll define this component separately below
const ProjectProgressCard = React.lazy(() => import('./ProjectProgressCard'));

export default ProjectDetailsTab;
