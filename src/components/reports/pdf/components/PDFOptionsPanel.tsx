
import React from 'react';
import { PDFOptions } from '../types';
import PDFOptionsCheckbox from './PDFOptionsCheckbox';

interface PDFOptionsPanelProps {
  options: PDFOptions;
  onChange: (option: keyof PDFOptions, value: boolean) => void;
  isBlankWorksheet?: boolean;
}

const PDFOptionsPanel = ({ options, onChange, isBlankWorksheet = false }: PDFOptionsPanelProps) => {
  const suffix = isBlankWorksheet ? '-blank' : '';

  return (
    <div className="border rounded-md p-3 space-y-3">
      <h3 className="font-medium">Options d'affichage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <PDFOptionsCheckbox 
          id={`include-company-info${suffix}`}
          label="Informations de l'entreprise"
          checked={options.includeCompanyInfo}
          onCheckedChange={(checked) => onChange('includeCompanyInfo', checked)}
        />
        
        {!isBlankWorksheet && (
          <PDFOptionsCheckbox 
            id={`include-contact-info${suffix}`}
            label="Informations du chantier"
            checked={options.includeContactInfo}
            onCheckedChange={(checked) => onChange('includeContactInfo', checked)}
          />
        )}
        
        <PDFOptionsCheckbox 
          id={`include-personnel${suffix}`}
          label="Personnel"
          checked={options.includePersonnel}
          onCheckedChange={(checked) => onChange('includePersonnel', checked)}
        />
        
        <PDFOptionsCheckbox 
          id={`include-tasks${suffix}`}
          label="Travaux effectués"
          checked={options.includeTasks}
          onCheckedChange={(checked) => onChange('includeTasks', checked)}
        />
        
        {!isBlankWorksheet && (
          <PDFOptionsCheckbox 
            id={`include-watering${suffix}`}
            label="Arrosages"
            checked={options.includeWatering}
            onCheckedChange={(checked) => onChange('includeWatering', checked)}
          />
        )}
        
        <PDFOptionsCheckbox 
          id={`include-notes${suffix}`}
          label="Notes et observations"
          checked={options.includeNotes}
          onCheckedChange={(checked) => onChange('includeNotes', checked)}
        />
        
        <PDFOptionsCheckbox 
          id={`include-time-tracking${suffix}`}
          label="Suivi de temps"
          checked={options.includeTimeTracking}
          onCheckedChange={(checked) => onChange('includeTimeTracking', checked)}
        />
        
        {isBlankWorksheet && (
          <PDFOptionsCheckbox 
            id={`include-summary${suffix}`}
            label="Bilan financier"
            checked={options.includeSummary}
            onCheckedChange={(checked) => onChange('includeSummary', checked)}
          />
        )}
      </div>
    </div>
  );
};

export default PDFOptionsPanel;
