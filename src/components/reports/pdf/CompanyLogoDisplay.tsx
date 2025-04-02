
import CompanyLogo from '@/components/ui/company-logo';

interface CompanyLogoDisplayProps {
  show: boolean;
  className?: string;
}

const CompanyLogoDisplay = ({ show, className = "h-16 w-auto" }: CompanyLogoDisplayProps) => {
  if (!show) return null;
  
  return (
    <div className="mb-4 flex justify-center">
      <CompanyLogo className={className} />
    </div>
  );
};

export default CompanyLogoDisplay;
