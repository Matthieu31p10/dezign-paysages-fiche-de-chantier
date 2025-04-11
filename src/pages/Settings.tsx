
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LogoSettings from '@/components/settings/LogoSettings';
import AccessControl from '@/components/settings/AccessControl';
import LoginSettings from '@/components/settings/LoginSettings';
import UserList from '@/components/settings/UserList';
import AddUserDialog from '@/components/settings/AddUserDialog';
import { UserCog, Users, LogIn, Building, ShieldCheck, Database } from 'lucide-react';
import BackupRestoreSection from '@/components/settings/BackupRestoreSection';

const Settings = () => {
  const { auth, canUserAccess } = useAuth();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  const canManageUsers = canUserAccess('admin');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de l'application
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="company">
        <TabsList className="w-full grid grid-cols-3 sm:grid-cols-4 lg:w-auto">
          <TabsTrigger value="company" className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Entreprise</span>
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
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs ayant accès à l'application
                </CardDescription>
              </div>
              
              <AddUserDialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
              >
                <Button onClick={() => setIsAddUserDialogOpen(true)}>
                  Ajouter un utilisateur
                </Button>
              </AddUserDialog>
            </CardHeader>
            <CardContent>
              <UserList />
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
      </Tabs>
    </div>
  );
};

export default Settings;
