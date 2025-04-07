
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoSettings from '@/components/settings/LogoSettings';
import UserList from '@/components/settings/UserList';
import LoginSettings from '@/components/settings/LoginSettings';
import AccessControl from '@/components/settings/AccessControl';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  const { canUserAccess } = useApp();
  const isAdmin = canUserAccess('admin');
  const isManager = canUserAccess('manager');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre application
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" /> 
            Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette section vous permet de configurer les différents aspects de l'application.
            {!isAdmin && !isManager && " Certaines fonctionnalités ne sont accessibles qu'aux administrateurs et gestionnaires."}
          </p>
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin}>Utilisateurs</TabsTrigger>
          <TabsTrigger value="access" disabled={!isManager}>Accès</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="space-y-4 pt-4">
          <LogoSettings />
        </TabsContent>
        
        <TabsContent value="login" className="space-y-4 pt-4">
          <LoginSettings />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          {isAdmin ? (
            <UserList isAdmin={isAdmin} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                Vous devez être administrateur pour accéder à cette section.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4 pt-4">
          {isManager ? (
            <AccessControl isAdmin={isAdmin} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                Vous devez être gestionnaire ou administrateur pour accéder à cette section.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
