import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs } from '@/components/ui/tabs';
import AddUserDialog from '@/components/settings/AddUserDialog';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsTabsList from '@/components/settings/SettingsTabsList';
import SettingsTabsContent from '@/components/settings/SettingsTabsContent';

const Settings = () => {
  const { canUserAccess } = useApp();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  const canManageUsers = canUserAccess('admin');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <SettingsHeader />
      
      <Tabs defaultValue="company">
        <SettingsTabsList canManageUsers={canManageUsers} />
        
        <SettingsTabsContent 
          canManageUsers={canManageUsers}
          onAddUserClick={() => setIsAddUserDialogOpen(true)}
        />
      </Tabs>
      
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
      />
    </div>
  );
};

export default Settings;
