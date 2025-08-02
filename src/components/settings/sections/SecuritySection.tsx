import AccessControl from '@/components/settings/AccessControl';
import LoginSettings from '@/components/settings/LoginSettings';
import SettingsCard from '@/components/settings/components/SettingsCard';

interface SecuritySectionProps {
  canManageUsers: boolean;
}

const SecuritySection = ({ canManageUsers }: SecuritySectionProps) => {
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Paramètres de connexion"
        description="Configurez les options d'authentification"
      >
        <LoginSettings />
      </SettingsCard>

      {canManageUsers && (
        <SettingsCard 
          title="Contrôle d'accès"
          description="Gérez les permissions des utilisateurs"
        >
          <AccessControl isAdmin={canManageUsers} />
        </SettingsCard>
      )}
    </div>
  );
};

export default SecuritySection;