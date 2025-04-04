
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { generatePDF } from '@/utils/pdf';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PDFOptions {
  includeContactInfo: boolean;
  includeCompanyInfo: boolean;
  includePersonnel: boolean;
  includeTasks: boolean;
  includeWatering: boolean;
  includeNotes: boolean;
  includeTimeTracking: boolean;
}

const WorklogsPDFTab = () => {
  const { workLogs, getProjectById, settings } = useApp();
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string>('');
  
  // Options PDF avec valeurs par défaut (toutes activées)
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true
  });
  
  // Sécurité: vérifier que les fiches de suivi sont disponibles
  const availableWorkLogs = workLogs.filter(log => {
    const project = getProjectById(log.projectId);
    return project && log.personnel && log.personnel.length > 0;
  });
  
  const handleOptionChange = (option: keyof PDFOptions, value: boolean) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleGenerateWorkLogPDF = async () => {
    if (!selectedWorkLogId) {
      toast.error('Veuillez sélectionner une fiche de suivi');
      return;
    }
    
    const workLog = workLogs.find(log => log.id === selectedWorkLogId);
    if (!workLog) {
      toast.error('Fiche de suivi non trouvée');
      return;
    }
    
    // Sécurité: vérification supplémentaire
    if (!workLog.personnel || workLog.personnel.length === 0) {
      toast.error('Cette fiche de suivi n\'a pas de personnel assigné');
      return;
    }
    
    const project = pdfOptions.includeContactInfo ? getProjectById(workLog.projectId) : undefined;
    
    try {
      // Utilisation de la fonction generatePDF avec les informations de l'entreprise et les options
      const pdfData = {
        workLog,
        project,
        companyInfo: pdfOptions.includeCompanyInfo ? settings.companyInfo : undefined,
        companyLogo: pdfOptions.includeCompanyInfo ? settings.companyLogo : undefined,
        pdfOptions
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
      <div className="space-y-2 pt-2">
        <Label htmlFor="worklog-select">Sélectionner une fiche de suivi</Label>
        <Select 
          value={selectedWorkLogId} 
          onValueChange={setSelectedWorkLogId}
        >
          <SelectTrigger id="worklog-select">
            <SelectValue placeholder="Choisir une fiche de suivi" />
          </SelectTrigger>
          <SelectContent>
            {availableWorkLogs.length === 0 ? (
              <SelectItem value="none" disabled>Aucune fiche de suivi disponible</SelectItem>
            ) : (
              availableWorkLogs.map(workLog => {
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
            disabled={!selectedWorkLogId || availableWorkLogs.length === 0}
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
            <AlertDialogAction onClick={handleGenerateWorkLogPDF}>
              Générer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorklogsPDFTab;
