import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdvancedPermissions } from '@/hooks/usePermissions';
import { Building, Database, User, UsersRound, UserCheck, Bug, Settings as SettingsIcon, History, Users, LogIn, Palette, ShieldCheck, Zap, Activity } from 'lucide-react';

interface SettingsTabsListProps {
  canManageUsers: boolean;
}

const SettingsTabsList = ({ canManageUsers }: SettingsTabsListProps) => {
  const permissions = useAdvancedPermissions();
  return (
    <div className="w-full overflow-x-auto">
      <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-muted p-1 text-muted-foreground min-w-max gap-1">
        <TabsTrigger 
          value="company" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Building className="h-4 w-4 text-blue-600" />
          <span className="hidden sm:inline font-medium">Entreprise</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="teams" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <UsersRound className="h-4 w-4 text-green-600" />
          <span className="hidden sm:inline font-medium">Équipes</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="personnel" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <User className="h-4 w-4 text-purple-600" />
          <span className="hidden sm:inline font-medium">Personnel</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="clients" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <UserCheck className="h-4 w-4 text-cyan-600" />
          <span className="hidden sm:inline font-medium">Clients</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="users" 
          disabled={!permissions.canManageUsers} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Users className="h-4 w-4 text-orange-600" />
          <span className="hidden sm:inline font-medium">Utilisateurs</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="login" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <LogIn className="h-4 w-4 text-indigo-600" />
          <span className="hidden sm:inline font-medium">Connexion</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="history" 
          disabled={!permissions.canViewLoginHistory} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <History className="h-4 w-4 text-amber-600" />
          <span className="hidden sm:inline font-medium">Historique</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="backup" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Database className="h-4 w-4 text-teal-600" />
          <span className="hidden sm:inline font-medium">Sauvegarde</span>
        </TabsTrigger>
      
        <TabsTrigger 
          value="advanced" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <SettingsIcon className="h-4 w-4 text-slate-600" />
          <span className="hidden sm:inline font-medium">Avancé</span>
        </TabsTrigger>

        <TabsTrigger 
          value="ux-demo" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Palette className="h-4 w-4 text-pink-600" />
          <span className="hidden sm:inline font-medium">UX Demo</span>
        </TabsTrigger>

        <TabsTrigger 
          value="permissions-demo" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline font-medium">Permissions</span>
        </TabsTrigger>

        <TabsTrigger 
          value="performance-demo" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Zap className="h-4 w-4 text-yellow-600" />
          <span className="hidden sm:inline font-medium">Performance</span>
        </TabsTrigger>

        <TabsTrigger 
          value="monitoring" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
        >
          <Activity className="h-4 w-4 text-red-600" />
          <span className="hidden sm:inline font-medium">Monitoring</span>
        </TabsTrigger>
      
        {permissions.canViewErrors && (
          <TabsTrigger 
            value="errors" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 gap-2 min-w-fit"
          >
            <Bug className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline font-medium">Erreurs</span>
          </TabsTrigger>
        )}
      </TabsList>
    </div>
  );
};

export default SettingsTabsList;