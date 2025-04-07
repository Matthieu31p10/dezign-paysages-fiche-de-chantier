
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoSettings from '@/components/settings/LogoSettings';
import UserList from '@/components/settings/UserList';
import LoginSettings from '@/components/settings/LoginSettings';
import AccessControl from '@/components/settings/AccessControl';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import { Palette, Users, Lock, Image, LogIn } from 'lucide-react';

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
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center">
            <Image className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logo</span>
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center">
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Connexion</span>
          </TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin} className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="access" disabled={!isManager} className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Accès</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <AppearanceSettings />
        </TabsContent>
        
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
