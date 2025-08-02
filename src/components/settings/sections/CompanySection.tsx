import LogoSettings from '@/components/settings/LogoSettings';
import SettingsCard from '@/components/settings/components/SettingsCard';

const CompanySection = () => {
  return (
    <div className="space-y-6">
      <SettingsCard 
        title="Informations de l'entreprise"
        description="Gérez les informations générales de votre entreprise"
      >
        <LogoSettings />
      </SettingsCard>
    </div>
  );
};

export default CompanySection;