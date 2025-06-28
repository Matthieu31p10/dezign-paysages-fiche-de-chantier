
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClientConnection, ProjectInfo, WorkLog } from '@/types/models';
import { 
  LogOut, 
  Building, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const [clientSession, setClientSession] = useState<ClientConnection | null>(null);
  const { projects, workLogs, settings } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const savedSession = localStorage.getItem('clientSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setClientSession(session);
      } catch (error) {
        console.error('Error parsing client session:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientSession');
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  if (!clientSession) {
    return <div>Chargement...</div>;
  }

  const clientProjects = projects.filter(project => 
    clientSession.assignedProjects.includes(project.id) && !project.isArchived
  );

  const getProjectWorkLogs = (projectId: string) => {
    return workLogs.filter(log => log.projectId === projectId && !log.isArchived);
  };

  const permissions = clientSession.visibilityPermissions || {};

  const renderProjectInfo = (project: ProjectInfo) => (
    <Card key={project.id} className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            {permissions.showProjectName && (
              <CardTitle className="text-xl">{project.name}</CardTitle>
            )}
            {permissions.showAddress && (
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {project.address}
              </CardDescription>
            )}
          </div>
          {permissions.showProjectType && (
            <Badge variant="outline">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.showClientName && (
            <div>
              <Label className="text-sm font-medium">Client</Label>
              <p className="text-sm text-muted-foreground">{project.clientName}</p>
            </div>
          )}
          
          {permissions.showContactInfo && (
            <>
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
            </>
          )}
          
          {permissions.showTeam && (
            <div>
              <Label className="text-sm font-medium">Équipe</Label>
              <p className="text-sm text-muted-foreground">{project.team}</p>
            </div>
          )}
        </div>

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
                      <div key={workLog.id} className="border rounded-lg p-3">
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
  );
};

// Helper component for labels
const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <label className={className}>{children}</label>
);

export default ClientDashboard;
