import TeamsManagement from '@/components/settings/TeamsManagement';
import SettingsCard from '@/components/settings/components/SettingsCard';

const TeamsSection = () => {
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Gestion des équipes"
        description="Créez et gérez vos équipes de travail"
      >
        <TeamsManagement />
      </SettingsCard>
    </div>
  );
};

export default TeamsSection;