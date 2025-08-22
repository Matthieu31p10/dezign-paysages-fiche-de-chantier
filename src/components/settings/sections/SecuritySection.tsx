import AccessControl from '@/components/settings/AccessControl';
import LoginSettings from '@/components/settings/LoginSettings';
import SettingsCard from '@/components/settings/components/SettingsCard';
import PermissionGate from '@/components/common/PermissionGate';
import { useAdvancedPermissions } from '@/hooks/usePermissions';
import SecuritySettings from '@/components/settings/SecuritySettings';
import SecurityDashboard from '@/components/security/SecurityDashboard';

interface SecuritySectionProps {
  canManageUsers: boolean;
}

const SecuritySection = ({ canManageUsers }: SecuritySectionProps) => {
  const permissions = useAdvancedPermissions();
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Sécurité Avancée"
        description="Configuration de la sécurité renforcée et authentification"
      >
        <SecuritySettings />
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

      <PermissionGate 
        permission="users.manage"
        fallback={
          <SettingsCard 
            title="Tableau de Bord Sécurité"
            description="Accès réservé aux administrateurs"
          >
            <p className="text-sm text-muted-foreground">
              Seuls les administrateurs peuvent accéder au monitoring de sécurité.
            </p>
          </SettingsCard>
        }
      >
        <SettingsCard 
          title="Monitoring & Audit"
          description="Surveillance en temps réel de la sécurité"
          className="col-span-full"
        >
          <SecurityDashboard />
        </SettingsCard>
      </PermissionGate>

      <SettingsCard 
        title="Paramètres de connexion (Legacy)"
        description="Configuration basique d'authentification"
      >
        <LoginSettings />
      </SettingsCard>
    </div>
  );
};

export default SecuritySection;