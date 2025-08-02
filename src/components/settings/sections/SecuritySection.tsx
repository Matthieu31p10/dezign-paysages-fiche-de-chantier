import AccessControl from '@/components/settings/AccessControl';
import LoginSettings from '@/components/settings/LoginSettings';
import SettingsCard from '@/components/settings/components/SettingsCard';
import PermissionGate from '@/components/common/PermissionGate';
import { useAdvancedPermissions } from '@/hooks/usePermissions';

interface SecuritySectionProps {
  canManageUsers: boolean;
}

const SecuritySection = ({ canManageUsers }: SecuritySectionProps) => {
  const permissions = useAdvancedPermissions();
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Paramètres de connexion"
        description="Configurez les options d'authentification"
      >
        <LoginSettings />
      </SettingsCard>

      <PermissionGate 
        permission="users.manage"
        fallback={
          <SettingsCard 
            title="Contrôle d'accès"
            description="Vous n'avez pas les permissions nécessaires pour gérer les contrôles d'accès"
          >
            <p className="text-sm text-muted-foreground">
              Contactez un administrateur pour obtenir l'accès à cette fonctionnalité.
            </p>
          </SettingsCard>
        }
      >
        <SettingsCard 
          title="Contrôle d'accès"
          description="Gérez les permissions des utilisateurs"
        >
          <AccessControl isAdmin={permissions.canManageUsers} />
        </SettingsCard>
      </PermissionGate>
    </div>
  );
};

export default SecuritySection;