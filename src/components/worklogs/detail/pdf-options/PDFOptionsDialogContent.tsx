
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { PDFOptions } from '../WorkLogDetailContext';
import OptionsTab from './OptionsTab';
import StyleTab from './StyleTab';
import PreviewTab from './PreviewTab';

interface PDFOptionsDialogContentProps {
  onOpenChange: (open: boolean) => void;
  onGeneratePDF: (options: PDFOptions & { theme?: string }) => void;
  initialOptions?: PDFOptions & { theme?: string };
}

const PDFOptionsDialogContent: React.FC<PDFOptionsDialogContentProps> = ({ 
  onOpenChange,
  onGeneratePDF,
  initialOptions = {
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true,
    includeWasteManagement: true,
    theme: 'default'
  }
}) => {
  const [pdfOptions, setPdfOptions] = useState<PDFOptions & { theme?: string }>(initialOptions);
  
  const handleOptionChange = (option: keyof PDFOptions) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  const handleThemeChange = (theme: string) => {
    setPdfOptions(prev => ({
      ...prev,
      theme
    }));
  };
  
  const handleGenerate = () => {
    onGeneratePDF(pdfOptions);
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Exporter en PDF
        </DialogTitle>
        <DialogDescription>
          Personnalisez les informations à inclure dans votre document
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <OptionsTab 
            pdfOptions={pdfOptions} 
            onOptionChange={handleOptionChange} 
          />
        </TabsContent>
        
        <TabsContent value="style">
          <StyleTab 
            selectedTheme={pdfOptions.theme || 'default'} 
            onThemeChange={handleThemeChange} 
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <PreviewTab 
            theme={pdfOptions.theme || 'default'} 
            pdfOptions={pdfOptions} 
          />
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button type="button" onClick={handleGenerate}>
          <FileText className="h-4 w-4 mr-2" />
          Générer PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PDFOptionsDialogContent;
