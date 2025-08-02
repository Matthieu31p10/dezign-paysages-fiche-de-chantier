import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserList from '@/components/settings/UserList';
import SettingsCard from '@/components/settings/components/SettingsCard';
import PermissionGate from '@/components/common/PermissionGate';
import { useAdvancedPermissions } from '@/hooks/usePermissions';

interface UsersSectionProps {
  canManageUsers: boolean;
  onAddUserClick: () => void;
}

const UsersSection = ({ canManageUsers, onAddUserClick }: UsersSectionProps) => {
  const permissions = useAdvancedPermissions();
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Gestion des utilisateurs"
        description="Gérez les comptes utilisateurs et leurs permissions"
      >
        <div className="space-y-4">
          <PermissionGate permission="users.manage">
            <Button onClick={onAddUserClick} className="mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </PermissionGate>
          <UserList isAdmin={permissions.canManageUsers} />
        </div>
      </SettingsCard>
    </div>
  );
};

export default UsersSection;