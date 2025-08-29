import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plug, Settings, Download, Upload, Database, 
  Mail, Calendar, FileText, DollarSign, 
  CheckCircle, AlertTriangle, Clock, RefreshCw,
  Plus, Edit, Trash2, Activity, BarChart3,
  Webhook, Cloud, Shield, Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'accounting' | 'crm' | 'calendar' | 'email' | 'storage' | 'analytics' | 'payment';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  provider: string;
  lastSync?: Date;
  config: {
    autoSync: boolean;
    syncInterval: number;
    fields: string[];
  };
  stats: {
    recordsSynced: number;
    errors: number;
    lastErrorMessage?: string;
  };
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  isActive: boolean;
  rateLimitPerMinute: number;
  authRequired: boolean;
  lastUsed?: Date;
  usageCount: number;
}

interface DataExportJob {
  id: string;
  name: string;
  dataType: 'projects' | 'worklogs' | 'personnel' | 'analytics' | 'all';
  format: 'csv' | 'json' | 'excel' | 'pdf';
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  destination: 'email' | 'ftp' | 'cloud' | 'webhook';
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
}

const EnterpriseIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'QuickBooks Online',
      description: 'Synchronisation automatique de la facturation et des finances',
      category: 'accounting',
      status: 'connected',
      provider: 'Intuit',
      lastSync: new Date(Date.now() - 3600000),
      config: {
        autoSync: true,
        syncInterval: 60,
        fields: ['invoices', 'payments', 'expenses']
      },
      stats: {
        recordsSynced: 1247,
        errors: 2
      }
    },
    {
      id: '2',
      name: 'Salesforce CRM',
      description: 'Gestion des clients et des opportunités commerciales',
      category: 'crm',
      status: 'connected',
      provider: 'Salesforce',
      lastSync: new Date(Date.now() - 1800000),
      config: {
        autoSync: true,
        syncInterval: 30,
        fields: ['contacts', 'accounts', 'opportunities']
      },
      stats: {
        recordsSynced: 894,
        errors: 0
      }
    },
    {
      id: '3',
      name: 'Google Workspace',
      description: 'Calendrier, email et stockage de documents',
      category: 'calendar',
      status: 'syncing',
      provider: 'Google',
      lastSync: new Date(),
      config: {
        autoSync: true,
        syncInterval: 15,
        fields: ['calendar', 'drive', 'gmail']
      },
      stats: {
        recordsSynced: 2341,
        errors: 1,
        lastErrorMessage: 'Rate limit exceeded'
      }
    },
    {
      id: '4',
      name: 'Stripe Payments',
      description: 'Traitement des paiements et gestion des abonnements',
      category: 'payment',
      status: 'disconnected',
      provider: 'Stripe',
      config: {
        autoSync: false,
        syncInterval: 60,
        fields: ['payments', 'subscriptions', 'customers']
      },
      stats: {
        recordsSynced: 0,
        errors: 0
      }
    }
  ]);

  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'Projects API',
      method: 'GET',
      endpoint: '/api/v1/projects',
      description: 'Récupération de la liste des projets',
      isActive: true,
      rateLimitPerMinute: 100,
      authRequired: true,
      lastUsed: new Date(Date.now() - 300000),
      usageCount: 1247
    },
    {
      id: '2',
      name: 'Create Work Log',
      method: 'POST',
      endpoint: '/api/v1/worklogs',
      description: 'Création d\'un nouveau journal de travail',
      isActive: true,
      rateLimitPerMinute: 50,
      authRequired: true,
      lastUsed: new Date(Date.now() - 600000),
      usageCount: 894
    },
    {
      id: '3',
      name: 'Analytics Data',
      method: 'GET',
      endpoint: '/api/v1/analytics/dashboard',
      description: 'Données analytiques pour tableaux de bord externes',
      isActive: true,
      rateLimitPerMinute: 200,
      authRequired: true,
      lastUsed: new Date(Date.now() - 180000),
      usageCount: 567
    }
  ]);

  const [exportJobs, setExportJobs] = useState<DataExportJob[]>([
    {
      id: '1',
      name: 'Rapport Mensuel Projets',
      dataType: 'projects',
      format: 'excel',
      schedule: 'monthly',
      destination: 'email',
      status: 'active',
      lastRun: new Date(Date.now() - 86400000 * 30),
      nextRun: new Date(Date.now() + 86400000 * 2)
    },
    {
      id: '2',
      name: 'Export Hebdomadaire Personnel',
      dataType: 'personnel',
      format: 'csv',
      schedule: 'weekly',
      destination: 'ftp',
      status: 'active',
      lastRun: new Date(Date.now() - 86400000 * 7),
      nextRun: new Date(Date.now() + 86400000)
    },
    {
      id: '3',
      name: 'Backup Complet',
      dataType: 'all',
      format: 'json',
      schedule: 'daily',
      destination: 'cloud',
      status: 'paused',
      lastRun: new Date(Date.now() - 86400000 * 3)
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'disconnected': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'disconnected': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accounting': return <DollarSign className="h-5 w-5" />;
      case 'crm': return <Database className="h-5 w-5" />;
      case 'calendar': return <Calendar className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'storage': return <Cloud className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'payment': return <DollarSign className="h-5 w-5" />;
      default: return <Plug className="h-5 w-5" />;
    }
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              status: integration.status === 'connected' ? 'disconnected' : 'connected'
            }
          : integration
      )
    );
    toast.success('Intégration mise à jour');
  };

  const handleSyncIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: 'syncing', lastSync: new Date() }
          : integration
      )
    );

    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === integrationId
            ? { ...integration, status: 'connected' }
            : integration
        )
      );
      toast.success('Synchronisation terminée');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plug className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Intégrations Actives</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Synchronisations/Jour</p>
                <p className="text-2xl font-bold text-green-600">247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appels API/Heure</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sécurité</p>
                <p className="text-2xl font-bold text-purple-600">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="exports">Exports de Données</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Intégrations Tierces</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Intégration
            </Button>
          </div>

          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full ${
                  integration.status === 'connected' ? 'bg-green-500' :
                  integration.status === 'syncing' ? 'bg-blue-500' :
                  integration.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                }`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getCategoryIcon(integration.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1 capitalize">{integration.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">FOURNISSEUR</Label>
                      <p className="font-medium">{integration.provider}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DERNIÈRE SYNC</Label>
                      <p className="font-medium">
                        {integration.lastSync?.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">ENREGISTREMENTS</Label>
                      <p className="font-medium text-green-600">{integration.stats.recordsSynced}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">ERREURS</Label>
                      <p className={`font-medium ${integration.stats.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {integration.stats.errors}
                      </p>
                    </div>
                  </div>

                  {integration.stats.lastErrorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                        {integration.stats.lastErrorMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`auto-sync-${integration.id}`} className="text-sm">
                          Sync automatique
                        </Label>
                        <Switch 
                          id={`auto-sync-${integration.id}`}
                          checked={integration.config.autoSync}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Toutes les {integration.config.syncInterval} min
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncIntegration(integration.id)}
                        disabled={integration.status === 'syncing'}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                        Synchroniser
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurer
                      </Button>
                      <Button 
                        variant={integration.status === 'connected' ? 'destructive' : 'default'} 
                        size="sm"
                        onClick={() => handleToggleIntegration(integration.id)}
                      >
                        {integration.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestion des API</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Endpoint
            </Button>
          </div>

          <div className="grid gap-4">
            {apiEndpoints.map((endpoint) => (
              <Card key={endpoint.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 
                                    endpoint.method === 'POST' ? 'default' : 
                                    endpoint.method === 'PUT' ? 'outline' : 'destructive'}>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {endpoint.endpoint}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch checked={endpoint.isActive} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {endpoint.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">LIMITE DÉBIT</Label>
                      <p className="font-medium">{endpoint.rateLimitPerMinute}/min</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">AUTHENTIFICATION</Label>
                      <Badge variant={endpoint.authRequired ? 'default' : 'secondary'}>
                        {endpoint.authRequired ? 'Requise' : 'Publique'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">UTILISATIONS</Label>
                      <p className="font-medium text-blue-600">{endpoint.usageCount}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DERNIÈRE UTILISATION</Label>
                      <p className="font-medium">
                        {endpoint.lastUsed?.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Exports de Données</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Export
            </Button>
          </div>

          <div className="grid gap-4">
            {exportJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Download className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.name}</CardTitle>
                        <CardDescription>
                          {job.dataType} • {job.format.toUpperCase()} • {job.schedule}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">TYPE DE DONNÉES</Label>
                      <p className="font-medium capitalize">{job.dataType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DESTINATION</Label>
                      <p className="font-medium capitalize">{job.destination}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DERNIÈRE EXÉCUTION</Label>
                      <p className="font-medium">
                        {job.lastRun?.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">PROCHAINE EXÉCUTION</Label>
                      <p className="font-medium text-blue-600">
                        {job.nextRun?.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exécuter Maintenant
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                    <Button 
                      variant={job.status === 'active' ? 'destructive' : 'default'} 
                      size="sm"
                    >
                      {job.status === 'active' ? 'Suspendre' : 'Activer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Webhooks</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Webhook
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Webhook className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration des Webhooks</h3>
                <p className="text-muted-foreground mb-4">
                  Configurez des webhooks pour recevoir des notifications en temps réel 
                  sur les événements de votre application.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Configurer le premier webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseIntegrations;