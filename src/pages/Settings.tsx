
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoSettings from '@/components/settings/LogoSettings';
import UserList from '@/components/settings/UserList';

const Settings = () => {
  const { canUserAccess } = useApp();
  const isAdmin = canUserAccess('admin');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre application
        </p>
      </div>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin}>Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="space-y-4 pt-4">
          <LogoSettings />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          <UserList isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
