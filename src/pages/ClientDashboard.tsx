import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useClientAuth } from '@/hooks/useClientAuth';
import { 
  LogOut, 
  Building, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  FileText
} from 'lucide-react';
import SessionManager from '@/components/auth/SessionManager';

const ClientDashboard = () => {
  const { 
    currentClient, 
    loading, 
    logoutClient, 
    getClientProjects, 
    getClientWorkLogs, 
    canViewField, 
    isAuthenticated 
  } = useClientAuth();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [workLogs, setWorkLogs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadClientData();
  }, [isAuthenticated, navigate]);

  const loadClientData = async () => {
    try {
      setLoadingData(true);
      const [projectsData, workLogsData] = await Promise.all([
        getClientProjects(),
        getClientWorkLogs()
      ]);
      
      setProjects(projectsData);
      setWorkLogs(workLogsData);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logoutClient();
    navigate('/login');
  };

  const getProjectWorkLogs = (projectId: string) => {
    return workLogs.filter(log => log.project_id === projectId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentClient) {
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

  const renderProjectInfo = (project: any) => (
    <Card key={project.id} className="mb-6 border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {canViewField('showProjectName') && (
              <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
            )}
            {canViewField('showAddress') && (
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{project.address}</span>
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className="ml-2">
            {project.project_type || 'Projet'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canViewField('showProjectName') && project.client_name && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
              <p className="text-sm">{project.client_name}</p>
            </div>
          )}
          
          <div className="space-y-2">
            {project.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.contact_phone}</span>
              </div>
            )}
            {project.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.contact_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informations contractuelles */}
        {(project.annual_visits || project.visit_duration || project.start_date) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.annual_visits && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Passages annuels</p>
                    <p className="text-sm text-muted-foreground">{project.annual_visits}</p>
                  </div>
                </div>
              )}
              
              {project.visit_duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Durée par passage</p>
                    <p className="text-sm text-muted-foreground">{project.visit_duration}h</p>
                  </div>
                </div>
              )}
              
              {project.start_date && (
                <div>
                  <p className="text-sm font-medium">Période</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.start_date)}
                    {project.end_date && ` - ${formatDate(project.end_date)}`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Informations techniques */}
        {(project.irrigation || project.mower_type) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.irrigation && (
                <div>
                  <p className="text-sm font-medium">Arrosage</p>
                  <p className="text-sm text-muted-foreground">{project.irrigation}</p>
                </div>
              )}
              
              {project.mower_type && (
                <div>
                  <p className="text-sm font-medium">Type de tondeuse</p>
                  <p className="text-sm text-muted-foreground">{project.mower_type}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Informations supplémentaires */}
        {project.additional_info && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Informations supplémentaires</p>
              <p className="text-sm text-muted-foreground">{project.additional_info}</p>
            </div>
          </>
        )}

        {/* Détails du contrat */}
        {project.contract_details && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Détails du contrat</p>
              <p className="text-sm text-muted-foreground">{project.contract_details}</p>
            </div>
          </>
        )}

        {/* Fiches de suivi */}
        {canViewField('showWorkLogs') && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Historique des interventions</p>
              {getProjectWorkLogs(project.id).length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune intervention enregistrée</p>
              ) : (
                <div className="space-y-3">
                  {getProjectWorkLogs(project.id)
                    .slice(0, 5)
                    .map((workLog: any) => (
                      <div key={workLog.id} className="border rounded-lg p-3 bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium">
                            {formatDate(workLog.date)}
                          </p>
                          <Badge variant={workLog.invoiced ? "default" : "secondary"}>
                            {workLog.invoiced ? 'Facturé' : 'Non facturé'}
                          </Badge>
                        </div>
                        
                        {workLog.personnel?.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {workLog.personnel.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {workLog.total_hours && (
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {workLog.total_hours}h
                            </span>
                          </div>
                        )}
                        
                        {canViewField('showTasks') && workLog.tasks && (
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{workLog.tasks}</span>
                          </div>
                        )}
                        
                        {workLog.notes && (
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
                  Bienvenue, {currentClient.client_name}
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
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun projet assigné
                </h3>
                <p className="text-gray-600 text-center">
                  Aucun projet n'est actuellement assigné à votre compte.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Vos projets ({projects.length})
                </h2>
                <p className="text-gray-600">
                  Consultez les informations de vos projets et leur historique.
                </p>
              </div>
              
              {projects.map(renderProjectInfo)}
            </div>
          )}
        </main>
      </div>
    </SessionManager>
  );
};

export default ClientDashboard;