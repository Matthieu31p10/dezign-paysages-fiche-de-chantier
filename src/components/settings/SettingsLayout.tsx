
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserCog, Settings as SettingsIcon, Users, Building, Database } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SettingsLayoutProps {
  children: ReactNode;
  defaultTab?: string;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  children, 
  defaultTab = "general" 
}) => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <div className="container mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue={defaultTab} className="space-y-8">
        <div className="bg-card border rounded-md p-1">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 w-full">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden md:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden md:inline">Entreprise</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden md:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Données</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {children}
      </Tabs>
    </div>
  );
};

export default SettingsLayout;
