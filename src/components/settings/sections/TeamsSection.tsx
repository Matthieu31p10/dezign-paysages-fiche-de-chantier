import TeamsManagement from '@/components/settings/TeamsManagement';
import SettingsSection from '@/components/settings/components/SettingsSection';

const TeamsSection = () => {
  const handleSave = async () => {
    // Simuler la sauvegarde des équipes
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  return (
    <div className="space-y-6">
      <SettingsSection 
        title="Gestion des équipes"
        description="Créez et gérez vos équipes de travail"
        onSave={handleSave}
      >
        <TeamsManagement />
      </SettingsSection>
    </div>
  );
};

export default TeamsSection;