
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PDFOptions } from '@/utils/pdf'
import { Building, Users, ClipboardList, FileText, Clock, Calculator } from 'lucide-react'

interface BlankSheetPDFOptionsDialogProps {
  onOpenChange: (isOpen: boolean) => void;
  onExport: (options: any) => Promise<void>;
  isLoading: boolean;
}

const BlankSheetPDFOptionsDialog: React.FC<BlankSheetPDFOptionsDialogProps> = ({ 
  onOpenChange, 
  onExport,
  isLoading
}) => {
  const [percentage, setPercentage] = React.useState(100);
  const [options, setOptions] = React.useState<PDFOptions>({
    includeCompanyInfo: true,
    includeContactInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeNotes: true,
    includeTimeTracking: true,
    includeSummary: true
  });

  const handleGenerate = () => {
    onExport({
      ...options,
      scale: percentage / 100
    });
  };

  const handleOptionChange = (option: keyof PDFOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>Options de génération PDF</AlertDialogTitle>
        <AlertDialogDescription>
          Ajustez les paramètres pour la génération du PDF.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="format">Format</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeCompanyInfo" 
                checked={options.includeCompanyInfo}
                onCheckedChange={() => handleOptionChange('includeCompanyInfo')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeCompanyInfo" className="text-sm leading-none">
                    Informations entreprise
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeContactInfo" 
                checked={options.includeContactInfo}
                onCheckedChange={() => handleOptionChange('includeContactInfo')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeContactInfo" className="text-sm leading-none">
                    Informations client
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includePersonnel" 
                checked={options.includePersonnel}
                onCheckedChange={() => handleOptionChange('includePersonnel')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includePersonnel" className="text-sm leading-none">
                    Personnel
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTasks" 
                checked={options.includeTasks}
                onCheckedChange={() => handleOptionChange('includeTasks')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <ClipboardList className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeTasks" className="text-sm leading-none">
                    Travaux effectués
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeNotes" 
                checked={options.includeNotes}
                onCheckedChange={() => handleOptionChange('includeNotes')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeNotes" className="text-sm leading-none">
                    Notes et observations
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeTimeTracking" 
                checked={options.includeTimeTracking}
                onCheckedChange={() => handleOptionChange('includeTimeTracking')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeTimeTracking" className="text-sm leading-none">
                    Suivi de temps
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeSummary" 
                checked={options.includeSummary}
                onCheckedChange={() => handleOptionChange('includeSummary')}
              />
              <div className="grid gap-0.5 leading-none">
                <div className="flex items-center">
                  <Calculator className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label htmlFor="includeSummary" className="text-sm leading-none">
                    Bilan financier
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="format">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="printPercentage" className="text-right">
                Pourcentage d'impression
              </Label>
              <Input 
                type="number" 
                id="printPercentage" 
                value={percentage.toString()} 
                className="col-span-3" 
                onChange={(e) => setPercentage(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider">Ajuster le pourcentage</Label>
              <Slider
                id="slider"
                defaultValue={[100]}
                max={100}
                min={1}
                step={1}
                value={[percentage]}
                onValueChange={(value) => setPercentage(value[0])}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>Annuler</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Génération..." : "Générer"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default BlankSheetPDFOptionsDialog;
