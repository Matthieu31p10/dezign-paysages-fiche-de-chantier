
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkLogDetail, PDFOptions } from './WorkLogDetailContext';
import CompanyLogo from '@/components/ui/company-logo';
import { FileText, Building, Users, ClipboardList, Droplets, FileText as Notes, Clock } from 'lucide-react';

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
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeCompanyInfo" 
                  checked={pdfOptions.includeCompanyInfo}
                  onCheckedChange={() => handleOptionChange('includeCompanyInfo')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeCompanyInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Informations entreprise
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Logo, nom, adresse, téléphone
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeContactInfo" 
                  checked={pdfOptions.includeContactInfo}
                  onCheckedChange={() => handleOptionChange('includeContactInfo')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeContactInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Informations chantier
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Nom, adresse, contact client
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includePersonnel" 
                  checked={pdfOptions.includePersonnel}
                  onCheckedChange={() => handleOptionChange('includePersonnel')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includePersonnel" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Personnel
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Liste du personnel présent
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeTasks" 
                  checked={pdfOptions.includeTasks}
                  onCheckedChange={() => handleOptionChange('includeTasks')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <ClipboardList className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeTasks" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Tâches personnalisées
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Travaux effectués et avancement
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeWatering" 
                  checked={pdfOptions.includeWatering}
                  onCheckedChange={() => handleOptionChange('includeWatering')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Droplets className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeWatering" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Arrosages
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    État et consommation d'eau
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeNotes" 
                  checked={pdfOptions.includeNotes}
                  onCheckedChange={() => handleOptionChange('includeNotes')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Notes className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeNotes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Notes et observations
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Commentaires et remarques
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeTimeTracking" 
                  checked={pdfOptions.includeTimeTracking}
                  onCheckedChange={() => handleOptionChange('includeTimeTracking')}
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <Label htmlFor="includeTimeTracking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Suivi de temps
                    </Label>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Heures de début, fin et pause
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="py-4">
            <div className="border rounded-md p-4 flex flex-col items-center">
              <div className="w-full max-w-md bg-white shadow-sm rounded-md border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <CompanyLogo className="w-14 h-14 p-1" />
                  </div>
                  <div>
                    <h3 className="font-bold">Fiche de suivi</h3>
                    <p className="text-sm text-gray-600">3 avril 2025</p>
                  </div>
                </div>
                
                <div className="text-center my-3">
                  <h4 className="font-medium">Détails du passage</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500 text-xs">Date</span>
                    <p>03/04/2025</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Durée prévue</span>
                    <p>5 heures</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Temps total</span>
                    <p>4.33 heures</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <span className="text-gray-500">Écart du temps</span>
                    <p className="text-green-600 font-bold">+1.56 h</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <span className="text-gray-500">Gestion déchets</span>
                    <p>1 Big-bag</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-3">
                  Aperçu simplifié du document PDF
                </div>
              </div>
            </div>
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
    </Dialog>
  );
};

export default PDFOptionsDialog;
