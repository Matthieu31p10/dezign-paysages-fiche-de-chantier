import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, Plug, BarChart3, MessageCircle, 
  Shield, Building, Zap, Rocket 
} from 'lucide-react';

// Phase 4 Components
import WorkflowAutomation from './workflow/WorkflowAutomation';
import EnterpriseIntegrations from './enterprise/EnterpriseIntegrations';
import BusinessIntelligence from './business-intelligence/BusinessIntelligence';
import RealTimeCollaboration from './collaboration/RealTimeCollaboration';

const Phase4Components: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Phase 4 - Enterprise Features</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fonctionnalités d'entreprise avancées : automatisation, intégrations, 
          business intelligence et collaboration en temps réel
        </p>
        <div className="flex justify-center space-x-2">
          <Badge className="bg-purple-100 text-purple-700">Automatisation</Badge>
          <Badge className="bg-blue-100 text-blue-700">Intégrations</Badge>
          <Badge className="bg-green-100 text-green-700">BI & Analytics</Badge>
          <Badge className="bg-orange-100 text-orange-700">Collaboration</Badge>
        </div>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Workflow className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Automatisation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Workflows intelligents, planification automatique et règles métier avancées
            </CardDescription>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">15 règles actives</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Plug className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Intégrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              APIs, webhooks, exports de données et connexions tierces
            </CardDescription>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">4 services connectés</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Business Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Tableaux de bord avancés, KPIs et prévisions basées sur l'IA
            </CardDescription>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">12 rapports actifs</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Collaboration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Chat temps réel, visioconférence et espaces de travail partagés
            </CardDescription>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">5 utilisateurs en ligne</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Interface */}
      <Tabs defaultValue="workflow" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Workflow className="h-4 w-4" />
            <span>Automatisation</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Plug className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="business-intelligence" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Business Intelligence</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Collaboration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <div className="border rounded-lg p-6">
            <WorkflowAutomation />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="border rounded-lg p-6">
            <EnterpriseIntegrations />
          </div>
        </TabsContent>

        <TabsContent value="business-intelligence" className="space-y-4">
          <div className="border rounded-lg p-6">
            <BusinessIntelligence />
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <div className="border rounded-lg p-6">
            <RealTimeCollaboration />
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Features Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sécurité Avancée</span>
            </CardTitle>
            <CardDescription>
              Audit trails, chiffrement et conformité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Événements de sécurité</span>
                <Badge className="bg-green-100 text-green-700">0 critique</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sessions actives</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conformité RGPD</span>
                <Badge className="bg-green-100 text-green-700">✓ Conforme</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Multi-tenant</span>
            </CardTitle>
            <CardDescription>
              Gestion des organisations et isolation des données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Organisations</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Utilisateurs totaux</span>
                <Badge variant="outline">47</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Espaces de stockage</span>
                <Badge className="bg-blue-100 text-blue-700">2.4 GB utilisés</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Phase4Components;