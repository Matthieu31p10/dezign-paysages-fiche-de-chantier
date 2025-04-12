
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { generatePDF } from '@/utils/pdf';
import { FileText, FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { extractClientName } from '@/utils/notes-extraction';
import { useLocation } from 'react-router-dom';

interface PDFOptions {
  includeContactInfo: boolean;
  includeCompanyInfo: boolean;
  includePersonnel: boolean;
  includeTasks: boolean;
  includeWatering: boolean;
  includeNotes: boolean;
  includeTimeTracking: boolean;
  includeSummary: boolean;
}

const WorklogsPDFTab = () => {
  const { workLogs, getProjectById, settings } = useApp();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const generateType = queryParams.get('generate');
  const generateId = queryParams.get('id');
  
  const [activeTab, setActiveTab] = useState<string>(generateType === 'blank' ? 'blank' : 'regular');
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string>(generateType === 'regular' ? (generateId || '') : '');
  const [selectedBlankWorkLogId, setSelectedBlankWorkLogId] = useState<string>(generateType === 'blank' ? (generateId || '') : '');
  
  // Auto-génération si les paramètres d'URL sont présents
  useEffect(() => {
    if (generateType && generateId) {
      if (generateType === 'blank' && selectedBlankWorkLogId === generateId) {
        handleGenerateWorkLogPDF(true);
      } else if (generateType === 'regular' && selectedWorkLogId === generateId) {
        handleGenerateWorkLogPDF(false);
      }
    }
  }, [selectedBlankWorkLogId, selectedWorkLogId, generateType, generateId]);
  
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true,
    includeSummary: true
  });
  
  const regularWorkLogs = workLogs.filter(log => {
    const project = getProjectById(log.projectId);
    return project && log.personnel && log.personnel.length > 0 && 
      (!log.projectId.startsWith('blank-') && !log.projectId.startsWith('DZFV'));
  });
  
  const blankWorksheets = workLogs.filter(log => {
    return (log.projectId?.startsWith('blank-') || log.projectId?.startsWith('DZFV'));
  });
  
  const handleOptionChange = (option: keyof PDFOptions, value: boolean) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleGenerateWorkLogPDF = async (isBlank: boolean = false) => {
    const selectedId = isBlank ? selectedBlankWorkLogId : selectedWorkLogId;
    
    if (!selectedId) {
      toast.error(`Veuillez sélectionner une fiche ${isBlank ? 'vierge' : 'de suivi'}`);
      return;
    }
    
    const workLog = workLogs.find(log => log.id === selectedId);
    if (!workLog) {
      toast.error('Fiche non trouvée');
      return;
    }
    
    // Ne pas exiger du personnel pour les fiches vierges
    if (!isBlank && (!workLog.personnel || workLog.personnel.length === 0)) {
      toast.warning('Cette fiche n\'a pas de personnel assigné');
    }
    
    const project = pdfOptions.includeContactInfo ? getProjectById(workLog.projectId) : undefined;
    
    try {
      const pdfData = {
        workLog,
        project,
        companyInfo: pdfOptions.includeCompanyInfo ? settings.companyInfo : undefined,
        companyLogo: pdfOptions.includeCompanyInfo ? settings.companyLogo : undefined,
        pdfOptions: {
          ...pdfOptions,
          includeSummary: pdfOptions.includeSummary
        }
      };
      
      const fileName = await generatePDF(pdfData);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Fiches de suivi</TabsTrigger>
          <TabsTrigger value="blank">Fiches vierges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="worklog-select">Sélectionner une fiche de suivi</Label>
            <Select 
              value={selectedWorkLogId} 
              onValueChange={setSelectedWorkLogId}
            >
              <SelectTrigger id="worklog-select">
                <SelectValue placeholder="Choisir une fiche de suivi" />
              </SelectTrigger>
              <SelectContent>
                {regularWorkLogs.length === 0 ? (
                  <SelectItem value="none" disabled>Aucune fiche de suivi disponible</SelectItem>
                ) : (
                  regularWorkLogs.map(workLog => {
                    const project = getProjectById(workLog.projectId);
                    return (
                      <SelectItem key={workLog.id} value={workLog.id}>
                        {formatDate(workLog.date)} - {project?.name || 'Chantier inconnu'}
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md p-3 space-y-3">
            <h3 className="font-medium">Options d'affichage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-company-info"
                  checked={pdfOptions.includeCompanyInfo}
                  onCheckedChange={(checked) => handleOptionChange('includeCompanyInfo', checked as boolean)}
                />
                <label 
                  htmlFor="include-company-info"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Informations de l'entreprise
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-contact-info"
                  checked={pdfOptions.includeContactInfo}
                  onCheckedChange={(checked) => handleOptionChange('includeContactInfo', checked as boolean)}
                />
                <label 
                  htmlFor="include-contact-info"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Informations du chantier
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-personnel"
                  checked={pdfOptions.includePersonnel}
                  onCheckedChange={(checked) => handleOptionChange('includePersonnel', checked as boolean)}
                />
                <label 
                  htmlFor="include-personnel"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Personnel
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-tasks"
                  checked={pdfOptions.includeTasks}
                  onCheckedChange={(checked) => handleOptionChange('includeTasks', checked as boolean)}
                />
                <label 
                  htmlFor="include-tasks"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Travaux effectués
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-watering"
                  checked={pdfOptions.includeWatering}
                  onCheckedChange={(checked) => handleOptionChange('includeWatering', checked as boolean)}
                />
                <label 
                  htmlFor="include-watering"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Arrosages
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-notes"
                  checked={pdfOptions.includeNotes}
                  onCheckedChange={(checked) => handleOptionChange('includeNotes', checked as boolean)}
                />
                <label 
                  htmlFor="include-notes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notes et observations
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-time-tracking"
                  checked={pdfOptions.includeTimeTracking}
                  onCheckedChange={(checked) => handleOptionChange('includeTimeTracking', checked as boolean)}
                />
                <label 
                  htmlFor="include-time-tracking"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Suivi de temps
                </label>
              </div>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={!selectedWorkLogId || regularWorkLogs.length === 0}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Générer PDF
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Générer un PDF</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous générer un PDF pour la fiche de suivi sélectionnée ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleGenerateWorkLogPDF(false)}>
                  Générer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
        
        <TabsContent value="blank" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="blank-worklog-select">Sélectionner une fiche vierge</Label>
            <Select 
              value={selectedBlankWorkLogId} 
              onValueChange={setSelectedBlankWorkLogId}
            >
              <SelectTrigger id="blank-worklog-select">
                <SelectValue placeholder="Choisir une fiche vierge" />
              </SelectTrigger>
              <SelectContent>
                {blankWorksheets.length === 0 ? (
                  <SelectItem value="none" disabled>
                    <div className="flex items-center">
                      <span>Aucune fiche vierge disponible</span>
                    </div>
                  </SelectItem>
                ) : (
                  blankWorksheets.map(workLog => {
                    const clientName = extractClientName(workLog.notes || '');
                    return (
                      <SelectItem key={workLog.id} value={workLog.id}>
                        <div className="flex items-center gap-2">
                          <span>{formatDate(workLog.date)}</span>
                          <span className="font-medium">{clientName || 'Client non spécifié'}</span>
                          <span className="text-muted-foreground text-xs">{workLog.projectId}</span>
                          <span className="ml-auto text-xs">{workLog.personnel?.length || 0} personnels</span>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md p-3 space-y-3">
            <h3 className="font-medium">Options d'affichage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-company-info-blank"
                  checked={pdfOptions.includeCompanyInfo}
                  onCheckedChange={(checked) => handleOptionChange('includeCompanyInfo', checked as boolean)}
                />
                <label 
                  htmlFor="include-company-info-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Informations de l'entreprise
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-personnel-blank"
                  checked={pdfOptions.includePersonnel}
                  onCheckedChange={(checked) => handleOptionChange('includePersonnel', checked as boolean)}
                />
                <label 
                  htmlFor="include-personnel-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Personnel
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-tasks-blank"
                  checked={pdfOptions.includeTasks}
                  onCheckedChange={(checked) => handleOptionChange('includeTasks', checked as boolean)}
                />
                <label 
                  htmlFor="include-tasks-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Travaux effectués
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-notes-blank"
                  checked={pdfOptions.includeNotes}
                  onCheckedChange={(checked) => handleOptionChange('includeNotes', checked as boolean)}
                />
                <label 
                  htmlFor="include-notes-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notes et observations
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-time-tracking-blank"
                  checked={pdfOptions.includeTimeTracking}
                  onCheckedChange={(checked) => handleOptionChange('includeTimeTracking', checked as boolean)}
                />
                <label 
                  htmlFor="include-time-tracking-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Suivi de temps
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-summary-blank"
                  checked={pdfOptions.includeSummary}
                  onCheckedChange={(checked) => handleOptionChange('includeSummary', checked as boolean)}
                />
                <label 
                  htmlFor="include-summary-blank"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bilan financier
                </label>
              </div>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={!selectedBlankWorkLogId || blankWorksheets.length === 0}
                className="w-full"
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Générer PDF
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Générer un PDF</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous générer un PDF pour la fiche vierge sélectionnée ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleGenerateWorkLogPDF(true)}>
                  Générer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorklogsPDFTab;
