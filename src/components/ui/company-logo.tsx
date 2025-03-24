
import { useApp } from '@/context/AppContext';
import { Image } from 'lucide-react';

interface CompanyLogoProps {
  className?: string;
}

const CompanyLogo = ({ className }: CompanyLogoProps) => {
  const { settings } = useApp();
  
  if (!settings.companyLogo) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded ${className}`}>
        <Image className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={settings.companyLogo} 
        alt="Logo de l'entreprise" 
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
};

export default CompanyLogo;
