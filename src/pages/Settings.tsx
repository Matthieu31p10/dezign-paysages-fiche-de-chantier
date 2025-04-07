
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoSettings from '@/components/settings/LogoSettings';
import UserList from '@/components/settings/UserList';
import LoginSettings from '@/components/settings/LoginSettings';
import AccessControl from '@/components/settings/AccessControl';

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
          <UserList isAdmin={isAdmin} />
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4 pt-4">
          <AccessControl isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
