import LogoSettings from '@/components/settings/LogoSettings';
import SettingsSection from '@/components/settings/components/SettingsSection';

const CompanySection = () => {
  const handleSave = async () => {
    // Simpler la sauvegarde des paramètres d'entreprise
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  return (
    <div className="space-y-6">
      <SettingsSection 
        title="Informations de l'entreprise"
        description="Gérez les informations générales de votre entreprise"
        onSave={handleSave}
      >
        <LogoSettings />
      </SettingsSection>
    </div>
  );
};

export default CompanySection;