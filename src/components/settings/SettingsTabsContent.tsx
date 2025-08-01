import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LogoSettings from './LogoSettings';
import AccessControl from './AccessControl';
import LoginSettings from './LoginSettings';
import UserList from './UserList';
import ClientConnectionsManagement from './ClientConnectionsManagement';
import { User, UsersRound, UserCheck, Bug, ShieldCheck, History } from 'lucide-react';
import BackupRestoreSection from './BackupRestoreSection';
import AdvancedSettingsPanel from './AdvancedSettingsPanel';
import TeamsManagement from './TeamsManagement';
import PersonnelManagement from './PersonnelManagement';
import LoginHistoryTab from './LoginHistoryTab';

interface SettingsTabsContentProps {
  canManageUsers: boolean;
  onAddUserClick: () => void;
}

const SettingsTabsContent = ({ canManageUsers, onAddUserClick }: SettingsTabsContentProps) => {
  return (
    <>
      <TabsContent value="company" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>
              Personnalisez les informations de votre entreprise qui apparaîtront sur les fiches de suivi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoSettings />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="teams" className="space-y-4">
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="flex items-center text-green-800">
              <UsersRound className="h-5 w-5 mr-2 text-green-600" />
              Gestion des équipes
            </CardTitle>
            <CardDescription>
              Gérez les équipes pour les fiches de suivi et fiches vierges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamsManagement />
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs ayant accès à l'application
              </CardDescription>
            </div>
            
            <Button onClick={onAddUserClick}>
              Ajouter un utilisateur
            </Button>
          </CardHeader>
          <CardContent>
            <UserList isAdmin={canManageUsers} />
          </CardContent>
        </Card>
        
        <AccessControl />
      </TabsContent>
      
      <TabsContent value="login" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              Paramètres de connexion
            </CardTitle>
            <CardDescription>
              Gérez les paramètres de connexion à l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginSettings />
          </CardContent>
        </Card>
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
      
      {process.env.NODE_ENV === 'development' && (
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-destructive" />
                Monitoring des erreurs
              </CardTitle>
              <CardDescription>
                Le nouveau système de gestion d'erreurs centralisé est activé.
                Les erreurs sont maintenant traitées automatiquement avec des notifications toast.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Le système d'erreurs a été migré vers une approche centralisée plus moderne.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default SettingsTabsContent;