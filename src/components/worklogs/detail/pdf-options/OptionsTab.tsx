
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Building, Users, ClipboardList, Droplets, FileText, Clock, Trash2 } from 'lucide-react';
import { PDFOptions } from '../WorkLogDetailContext';

interface OptionsTabProps {
  pdfOptions: PDFOptions & { theme?: string };
  onOptionChange: (option: keyof PDFOptions) => void;
}

const OptionItem = ({ 
  id, 
  checked, 
  onChange, 
  icon: Icon, 
  label, 
  description 
}: { 
  id: string; 
  checked: boolean; 
  onChange: () => void; 
  icon: React.ElementType; 
  label: string; 
  description: string;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox 
      id={id} 
      checked={checked}
      onCheckedChange={onChange}
    />
    <div className="grid gap-1.5 leading-none">
      <div className="flex items-center">
        <Icon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
        <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      </div>
      <p className="text-[0.8rem] text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
);

const OptionsTab: React.FC<OptionsTabProps> = ({ pdfOptions, onOptionChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OptionItem
          id="includeCompanyInfo"
          checked={pdfOptions.includeCompanyInfo}
          onChange={() => onOptionChange('includeCompanyInfo')}
          icon={Building}
          label="Informations entreprise"
          description="Logo, nom, adresse, téléphone"
        />
        
        <OptionItem
          id="includeContactInfo"
          checked={pdfOptions.includeContactInfo}
          onChange={() => onOptionChange('includeContactInfo')}
          icon={Building}
          label="Informations chantier"
          description="Nom, adresse, contact client"
        />
        
        <OptionItem
          id="includePersonnel"
          checked={pdfOptions.includePersonnel}
          onChange={() => onOptionChange('includePersonnel')}
          icon={Users}
          label="Personnel"
          description="Liste du personnel présent"
        />
        
        <OptionItem
          id="includeTasks"
          checked={pdfOptions.includeTasks}
          onChange={() => onOptionChange('includeTasks')}
          icon={ClipboardList}
          label="Tâches personnalisées"
          description="Travaux effectués et avancement"
        />
        
        <OptionItem
          id="includeWatering"
          checked={pdfOptions.includeWatering}
          onChange={() => onOptionChange('includeWatering')}
          icon={Droplets}
          label="Arrosages"
          description="État et consommation d'eau"
        />
        
        <OptionItem
          id="includeNotes"
          checked={pdfOptions.includeNotes}
          onChange={() => onOptionChange('includeNotes')}
          icon={FileText}
          label="Notes et observations"
          description="Commentaires et remarques"
        />
        
        <OptionItem
          id="includeTimeTracking"
          checked={pdfOptions.includeTimeTracking}
          onChange={() => onOptionChange('includeTimeTracking')}
          icon={Clock}
          label="Suivi de temps"
          description="Heures de début, fin et pause"
        />
        
        <OptionItem
          id="includeWasteManagement"
          checked={pdfOptions.includeWasteManagement}
          onChange={() => onOptionChange('includeWasteManagement')}
          icon={Trash2}
          label="Gestion des déchets"
          description="Informations sur la gestion des déchets"
        />
      </div>
    </div>
  );
};

export default OptionsTab;
