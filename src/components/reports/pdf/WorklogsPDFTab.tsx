
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

const WorklogsPDFTab = () => {
  const { workLogs, getProjectById, settings } = useApp();
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string>('');
  const [includeContactInfo, setIncludeContactInfo] = useState(true);
  const [includeCompanyInfo, setIncludeCompanyInfo] = useState(true);
  
  const handleGenerateWorkLogPDF = async () => {
    if (!selectedWorkLogId) {
      toast.error('Veuillez sélectionner une fiche de suivi');
      return;
    }
    
    const workLog = workLogs.find(log => log.id === selectedWorkLogId);
    if (!workLog) return;
    
    const project = includeContactInfo ? getProjectById(workLog.projectId) : undefined;
    
    try {
      // Using the generatePDF function with company info
      const pdfData = {
        workLog,
        project,
        companyInfo: includeCompanyInfo ? settings.companyInfo : undefined,
        companyLogo: includeCompanyInfo ? settings.companyLogo : undefined
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
            {workLogs.map(workLog => {
              const project = getProjectById(workLog.projectId);
              return (
                <SelectItem key={workLog.id} value={workLog.id}>
                  {formatDate(workLog.date)} - {project?.name || 'Chantier inconnu'}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-contact-info"
            checked={includeContactInfo}
            onCheckedChange={(checked) => setIncludeContactInfo(checked as boolean)}
          />
          <label 
            htmlFor="include-contact-info"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inclure les informations de contact
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-company-info"
            checked={includeCompanyInfo}
            onCheckedChange={(checked) => setIncludeCompanyInfo(checked as boolean)}
          />
          <label 
            htmlFor="include-company-info"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inclure les informations de l'entreprise
          </label>
        </div>
      </div>
      
      <Button 
        onClick={handleGenerateWorkLogPDF}
        disabled={!selectedWorkLogId}
        className="w-full"
      >
        <FileText className="h-4 w-4 mr-2" />
        Générer PDF
      </Button>
    </div>
  );
};

export default WorklogsPDFTab;
