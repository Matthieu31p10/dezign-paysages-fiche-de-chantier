import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PersonnelManagement from './PersonnelManagement';
import ClientConnectionsManagement from './ClientConnectionsManagement';
import BackupRestoreSection from './BackupRestoreSection';
import AdvancedSettingsPanel from './AdvancedSettingsPanel';
import LoginHistoryTab from './LoginHistoryTab';
import { User, UserCheck, Bug } from 'lucide-react';
import { useSettingsPermissions } from '@/components/settings/hooks/useSettingsPermissions';
import CompanySection from '@/components/settings/sections/CompanySection';
import TeamsSection from '@/components/settings/sections/TeamsSection';
import UsersSection from '@/components/settings/sections/UsersSection';
import SecuritySection from '@/components/settings/sections/SecuritySection';
import UXDemoSection from '@/components/settings/sections/UXDemoSection';
import PermissionsDemo from '@/components/settings/sections/PermissionsDemo';
import PerformanceDemoSection from '@/components/settings/sections/PerformanceDemoSection';
import MonitoringDashboard from '@/components/settings/sections/MonitoringDashboard';

interface SettingsTabsContentProps {
  canManageUsers: boolean;
  onAddUserClick: () => void;
}

const SettingsTabsContent = ({ canManageUsers, onAddUserClick }: SettingsTabsContentProps) => {
  const permissions = useSettingsPermissions();
  return (
    <>
      <TabsContent value="company" className="space-y-4">
        <CompanySection />
      </TabsContent>
      
      <TabsContent value="teams" className="space-y-4">
        <TeamsSection />
      </TabsContent>
      
      <TabsContent value="personnel" className="space-y-4">
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="flex items-center text-green-800">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Gestion du personnel
            </CardTitle>
            <CardDescription>
              Gérez le personnel pour les fiches de suivi et fiches vierges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonnelManagement />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="clients" className="space-y-4">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center text-blue-800">
              <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
              Clients de connexion
            </CardTitle>
            <CardDescription>
              Gérez les accès clients pour la consultation de leurs chantiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientConnectionsManagement />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UsersSection 
          canManageUsers={canManageUsers}
          onAddUserClick={onAddUserClick}
        />
      </TabsContent>
      
      <TabsContent value="login" className="space-y-4">
        <SecuritySection canManageUsers={canManageUsers} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <LoginHistoryTab />
      </TabsContent>
      
      <TabsContent value="backup" className="space-y-4">
        <BackupRestoreSection />
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <AdvancedSettingsPanel />
      </TabsContent>

      <TabsContent value="ux-demo" className="space-y-4">
        <UXDemoSection />
      </TabsContent>

      <TabsContent value="permissions-demo" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Démonstration des permissions</CardTitle>
            <CardDescription>
              Aperçu du nouveau système de permissions avancé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionsDemo />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance-demo" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Démonstration des performances</CardTitle>
            <CardDescription>
              Optimisations de performance et métriques en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceDemoSection />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monitoring et Analytics</CardTitle>
            <CardDescription>
              Surveillance système et analyse des performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonitoringDashboard />
          </CardContent>
        </Card>
      </TabsContent>
      
      {permissions.canViewErrors && (
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-muted-foreground" />
                Rapport d'erreurs
              </CardTitle>
              <CardDescription>
                Consultez les erreurs de l'application en mode développement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Le système d'erreurs est disponible uniquement en mode développement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default SettingsTabsContent;