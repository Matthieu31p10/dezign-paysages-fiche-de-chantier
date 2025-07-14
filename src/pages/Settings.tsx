import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LogoSettings from '@/components/settings/LogoSettings';
import AccessControl from '@/components/settings/AccessControl';
import LoginSettings from '@/components/settings/LoginSettings';
import UserList from '@/components/settings/UserList';
import AddUserDialog from '@/components/settings/AddUserDialog';
import ClientConnectionsManagement from '@/components/settings/ClientConnectionsManagement';
import { UserCog, Users, LogIn, Building, ShieldCheck, Database, User, UsersRound, UserCheck, Bug, Settings as SettingsIcon } from 'lucide-react';
import BackupRestoreSection from '@/components/settings/BackupRestoreSection';
import AdvancedSettingsPanel from '@/components/settings/AdvancedSettingsPanel';
import { DialogTrigger } from '@/components/ui/dialog';
import TeamsManagement from '@/components/settings/TeamsManagement';
import PersonnelManagement from '@/components/settings/PersonnelManagement';
import ErrorDashboard from '@/components/error/ErrorDashboard';

const Settings = () => {
  const { canUserAccess } = useApp();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  const canManageUsers = canUserAccess('admin');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-green-800">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de l'application
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="company">
        <TabsList className="w-full grid grid-cols-3 sm:grid-cols-9 lg:w-auto">
          <TabsTrigger value="company" className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Entreprise</span>
          </TabsTrigger>
          
          <TabsTrigger value="teams" className="flex items-center gap-1.5">
            <UsersRound className="h-4 w-4" />
            <span className="hidden sm:inline">Équipes</span>
          </TabsTrigger>
          
          <TabsTrigger value="personnel" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personnel</span>
          </TabsTrigger>
          
          <TabsTrigger value="clients" className="flex items-center gap-1.5">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          
          <TabsTrigger value="users" disabled={!canManageUsers} className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          
          <TabsTrigger value="login" className="flex items-center gap-1.5">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Connexion</span>
          </TabsTrigger>
          
          <TabsTrigger value="backup" className="flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sauvegarde</span>
          </TabsTrigger>
          
          <TabsTrigger value="advanced" className="flex items-center gap-1.5">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Avancé</span>
          </TabsTrigger>
          
          {process.env.NODE_ENV === 'development' && (
            <TabsTrigger value="errors" className="flex items-center gap-1.5">
              <Bug className="h-4 w-4" />
              <span className="hidden sm:inline">Erreurs</span>
            </TabsTrigger>
          )}
        </TabsList>
        
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
              
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
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
                  Visualisez et gérez les erreurs de l'application (mode développement)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
      />
    </div>
  );
};

export default Settings;
