import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsPermissions } from '@/components/settings/hooks/useSettingsPermissions';
import { Building, Database, User, UsersRound, UserCheck, Bug, Settings as SettingsIcon, History, Users, LogIn, Palette, ShieldCheck, Zap } from 'lucide-react';

interface SettingsTabsListProps {
  canManageUsers: boolean;
}

const SettingsTabsList = ({ canManageUsers }: SettingsTabsListProps) => {
  const permissions = useSettingsPermissions();
  return (
    <TabsList className="w-full grid grid-cols-3 sm:grid-cols-14 lg:w-auto">
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
      
      <TabsTrigger value="users" disabled={!permissions.canManageUsers} className="flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Utilisateurs</span>
      </TabsTrigger>
      
      <TabsTrigger value="login" className="flex items-center gap-1.5">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Connexion</span>
      </TabsTrigger>
      
      <TabsTrigger value="history" disabled={!permissions.canViewLoginHistory} className="flex items-center gap-1.5">
        <History className="h-4 w-4" />
        <span className="hidden sm:inline">Historique</span>
      </TabsTrigger>
      
      <TabsTrigger value="backup" className="flex items-center gap-1.5">
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">Sauvegarde</span>
      </TabsTrigger>
      
      <TabsTrigger value="advanced" className="flex items-center gap-1.5">
        <SettingsIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Avancé</span>
      </TabsTrigger>

      <TabsTrigger value="ux-demo" className="flex items-center gap-1.5">
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Démo UX</span>
      </TabsTrigger>

      <TabsTrigger value="permissions-demo" className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4" />
        <span className="hidden sm:inline">Permissions</span>
      </TabsTrigger>

      <TabsTrigger value="performance-demo" className="flex items-center gap-1.5">
        <Zap className="h-4 w-4" />
        <span className="hidden sm:inline">Performance</span>
      </TabsTrigger>
      
      {permissions.canViewErrors && (
        <TabsTrigger value="errors" className="flex items-center gap-1.5">
          <Bug className="h-4 w-4" />
          <span className="hidden sm:inline">Erreurs</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default SettingsTabsList;