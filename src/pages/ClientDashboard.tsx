
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClientConnection, ProjectInfo, WorkLog } from '@/types/models';
import { validateClientAccess } from '@/utils/security';
import { 
  LogOut, 
  Building, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import SessionManager from '@/components/auth/SessionManager';

const ClientDashboard = () => {
  const [clientSession, setClientSession] = useState<ClientConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { projects, workLogs, settings } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = () => {
      const savedSession = localStorage.getItem('clientSession');
      
      if (!savedSession) {
        navigate('/login');
        return;
      }

      try {
        const session = JSON.parse(savedSession);
        
        // Vérifier l'expiration de la session
        if (session.sessionExpiry && new Date() > new Date(session.sessionExpiry)) {
          localStorage.removeItem('clientSession');
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/login');
          return;
        }

        setClientSession(session);
      } catch (error) {
        console.error('Erreur lors du parsing de la session client:', error);
        localStorage.removeItem('clientSession');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!clientSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Session invalide</h3>
            <p className="text-muted-foreground mb-4">
              Votre session a expiré. Veuillez vous reconnecter.
            </p>
            <Button onClick={() => navigate('/login')}>
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrer les projets assignés au client avec validation de sécurité
  const clientProjects = projects.filter(project => 
    validateClientAccess(clientSession, project.id) && !project.isArchived
  );

  const getProjectWorkLogs = (projectId: string) => {
    // Vérifier l'accès avant de retourner les données
    if (!validateClientAccess(clientSession, projectId)) {
      return [];
    }
    return workLogs.filter(log => log.projectId === projectId && !log.isArchived);
  };

  const permissions = clientSession.visibilityPermissions || {};

  const renderProjectInfo = (project: ProjectInfo) => (
    <Card key={project.id} className="mb-6 border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {permissions.showProjectName && (
              <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
            )}
            {permissions.showAddress && (
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{project.address}</span>
              </CardDescription>
            )}
          </div>
          {permissions.showProjectType && (
            <Badge variant="outline" className="ml-2">
              {project.projectType === 'residence' ? 'Résidence' : 
               project.projectType === 'particular' ? 'Particulier' : 
               project.projectType === 'enterprise' ? 'Entreprise' : 
               'Ponctuel'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations générales */}
        {(permissions.showClientName || permissions.showContactInfo || permissions.showTeam) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.showClientName && project.clientName && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
                <p className="text-sm">{project.clientName}</p>
              </div>
            )}
            
            {permissions.showContactInfo && (
              <div className="space-y-2">
                {project.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.contact.phone}</span>
                  </div>
                )}
                {project.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.contact.email}</span>
                  </div>
                )}
              </div>
            )}
            
            {permissions.showTeam && project.team && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Équipe</h4>
                <p className="text-sm">{project.team}</p>
              </div>
            )}
          </div>
        )}

        {/* Informations contractuelles */}
        {(permissions.showAnnualVisits || permissions.showVisitDuration || permissions.showStartEndDates) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {permissions.showAnnualVisits && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Passages annuels</p>
                    <p className="text-sm text-muted-foreground">{project.annualVisits}</p>
                  </div>
                </div>
              )}
              
              {permissions.showVisitDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Durée par passage</p>
                    <p className="text-sm text-muted-foreground">{project.visitDuration}h</p>
                  </div>
                </div>
              )}
              
              {permissions.showStartEndDates && project.startDate && (
                <div>
                  <p className="text-sm font-medium">Période</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString('fr-FR')}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Informations techniques */}
        {(permissions.showIrrigation || permissions.showMowerType) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissions.showIrrigation && project.irrigation && (
                <div>
                  <p className="text-sm font-medium">Arrosage</p>
                  <p className="text-sm text-muted-foreground">
                    {project.irrigation === 'irrigation' ? 'Système d\'arrosage' : 'Aucun système'}
                  </p>
                </div>
              )}
              
              {permissions.showMowerType && project.mowerType && (
                <div>
                  <p className="text-sm font-medium">Type de tondeuse</p>
                  <p className="text-sm text-muted-foreground">
                    {project.mowerType === 'large' ? 'Grande tondeuse' : 
                     project.mowerType === 'small' ? 'Petite tondeuse' : 'Les deux'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Informations supplémentaires */}
        {permissions.showAdditionalInfo && project.additionalInfo && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Informations supplémentaires</p>
              <p className="text-sm text-muted-foreground">{project.additionalInfo}</p>
            </div>
          </>
        )}

        {/* Détails du contrat */}
        {permissions.showContractDetails && project.contract.details && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Détails du contrat</p>
              <p className="text-sm text-muted-foreground">{project.contract.details}</p>
            </div>
          </>
        )}

        {/* Fiches de suivi */}
        {permissions.showWorkLogs && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Historique des interventions</p>
              {getProjectWorkLogs(project.id).length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune intervention enregistrée</p>
              ) : (
                <div className="space-y-3">
                  {getProjectWorkLogs(project.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map(workLog => (
                      <div key={workLog.id} className="border rounded-lg p-3 bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium">
                            {new Date(workLog.date).toLocaleDateString('fr-FR')}
                          </p>
                          {permissions.showInvoicedStatus && (
                            <Badge variant={workLog.invoiced ? "default" : "secondary"}>
                              {workLog.invoiced ? 'Facturé' : 'Non facturé'}
                            </Badge>
                          )}
                        </div>
                        
                        {permissions.showPersonnel && workLog.personnel.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {workLog.personnel.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {permissions.showTimeTracking && workLog.timeTracking?.totalHours && (
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {workLog.timeTracking.totalHours}h
                            </span>
                          </div>
                        )}
                        
                        {permissions.showNotes && workLog.notes && (
                          <p className="text-xs text-muted-foreground">{workLog.notes}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <SessionManager>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tableau de bord client
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {clientSession.clientName}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {clientProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun chantier assigné
                </h3>
                <p className="text-gray-600 text-center">
                  Aucun chantier n'est actuellement assigné à votre compte.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Vos chantiers ({clientProjects.length})
                </h2>
                <p className="text-gray-600">
                  Consultez les informations de vos chantiers et leur historique.
                </p>
              </div>
              
              {clientProjects.map(renderProjectInfo)}
            </div>
          )}
        </main>
      </div>
    </SessionManager>
  );
};

export default ClientDashboard;
