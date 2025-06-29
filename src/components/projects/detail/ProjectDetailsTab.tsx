
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectInfo } from '@/types/models';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  Calendar,
  Clock,
  Users,
  Target,
  Info,
  CalendarDays
} from 'lucide-react';
import { useModernScheduleData } from '@/components/schedule/modern/hooks/useModernScheduleData';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectDetailsTabProps {
  project: ProjectInfo;
  teamName: string;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project, teamName }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  // Récupérer les passages planifiés pour ce projet
  const { scheduledEvents } = useModernScheduleData({
    selectedMonth: currentMonth,
    selectedYear: currentYear,
    selectedTeams: ['all'],
    showWeekends: true
  });

  // Filtrer les événements pour ce projet spécifique
  const projectEvents = scheduledEvents.filter(event => event.projectId === project.id);
  
  // Trier par date
  const sortedEvents = projectEvents.sort((a, b) => a.date.localeCompare(b.date));

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'residence': return 'Résidence';
      case 'particular': return 'Particulier';
      case 'enterprise': return 'Entreprise';
      default: return 'Non spécifié';
    }
  };

  const getIrrigationLabel = (irrigation: string) => {
    switch (irrigation) {
      case 'irrigation': return 'Avec arrosage';
      case 'none': return 'Sans arrosage';
      case 'disabled': return 'Arrosage désactivé';
      default: return 'Non spécifié';
    }
  };

  const getMowerLabel = (mowerType: string) => {
    switch (mowerType) {
      case 'large': return 'Grande tondeuse';
      case 'small': return 'Petite tondeuse';
      case 'both': return 'Les deux';
      default: return 'Non spécifié';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Type de projet</p>
              <p className="font-medium">{getProjectTypeLabel(project.projectType)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Adresse</p>
              <p className="font-medium">{project.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Équipe assignée</p>
              <Badge variant="secondary">{teamName}</Badge>
            </div>
          </div>

          {project.additionalInfo && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Informations supplémentaires</p>
                <p className="font-medium">{project.additionalInfo}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Contact client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Nom du client</p>
            <p className="font-medium">{project.clientName || 'Non renseigné'}</p>
          </div>

          {project.contact?.name && (
            <div>
              <p className="text-sm text-gray-600">Personne de contact</p>
              <p className="font-medium">{project.contact.name}</p>
            </div>
          )}

          {project.contact?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{project.contact.phone}</p>
              </div>
            </div>
          )}

          {project.contact?.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{project.contact.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Détails techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Détails techniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Passages annuels</p>
              <p className="font-medium text-lg">{project.annualVisits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Heures totales</p>
              <p className="font-medium text-lg">{project.annualTotalHours}h</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Durée par passage</p>
            <p className="font-medium">{project.visitDuration}h</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Arrosage</p>
            <p className="font-medium">{getIrrigationLabel(project.irrigation)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Type de tondeuse</p>
            <p className="font-medium">{getMowerLabel(project.mowerType)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Répartition des passages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600" />
            Répartition des passages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEvents.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Passages planifiés cette année :</span>
                <Badge variant="outline">
                  {sortedEvents.length} / {project.annualVisits}
                </Badge>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {sortedEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {format(parseISO(event.date), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Passage {event.passageNumber}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{event.visitDuration}h</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {sortedEvents.length < project.annualVisits && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>{project.annualVisits - sortedEvents.length}</strong> passage(s) restant(s) à planifier cette année
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Aucun passage planifié</h3>
              <p className="text-gray-600">
                Ce chantier n'a pas encore de passages planifiés pour cette année.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailsTab;
