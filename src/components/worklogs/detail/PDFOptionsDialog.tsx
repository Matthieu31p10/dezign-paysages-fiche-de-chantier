
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useWorkLogDetail, PDFOptions } from './WorkLogDetailContext';

interface PDFOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PDFOptionsDialog: React.FC<PDFOptionsDialogProps> = ({ open, onOpenChange }) => {
  const { handleExportToPDF } = useWorkLogDetail();
  
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true, 
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true
  });
  
  const handleOptionChange = (option: keyof PDFOptions) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  const handleGenerate = () => {
    handleExportToPDF(pdfOptions);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Options d'exportation PDF</DialogTitle>
          <DialogDescription>
            Choisissez les informations à inclure dans votre PDF
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeCompanyInfo" 
                checked={pdfOptions.includeCompanyInfo}
                onCheckedChange={() => handleOptionChange('includeCompanyInfo')}
              />
              <Label htmlFor="includeCompanyInfo">Informations entreprise</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeContactInfo" 
                checked={pdfOptions.includeContactInfo}
                onCheckedChange={() => handleOptionChange('includeContactInfo')}
              />
              <Label htmlFor="includeContactInfo">Informations chantier</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includePersonnel" 
                checked={pdfOptions.includePersonnel}
                onCheckedChange={() => handleOptionChange('includePersonnel')}
              />
              <Label htmlFor="includePersonnel">Personnel</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTasks" 
                checked={pdfOptions.includeTasks}
                onCheckedChange={() => handleOptionChange('includeTasks')}
              />
              <Label htmlFor="includeTasks">Travaux effectués</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeWatering" 
                checked={pdfOptions.includeWatering}
                onCheckedChange={() => handleOptionChange('includeWatering')}
              />
              <Label htmlFor="includeWatering">Arrosages</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeNotes" 
                checked={pdfOptions.includeNotes}
                onCheckedChange={() => handleOptionChange('includeNotes')}
              />
              <Label htmlFor="includeNotes">Notes</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTimeTracking" 
                checked={pdfOptions.includeTimeTracking}
                onCheckedChange={() => handleOptionChange('includeTimeTracking')}
              />
              <Label htmlFor="includeTimeTracking">Suivi de temps</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleGenerate}>
            Générer PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFOptionsDialog;
