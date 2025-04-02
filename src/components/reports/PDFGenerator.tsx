
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { generatePDF, generateProjectPDF, generateReportPDF, generateWorkLogPDF } from '@/utils/pdfGenerator';
import { FileText, Download, Calendar, FileOutput } from 'lucide-react';
import { toast } from 'sonner';
import { WorkLog } from '@/types/models';
import CompanyLogo from '../ui/company-logo';

const PDFGenerator = () => {
  const { projectInfos, workLogs, teams, getProjectById, settings } = useApp();
  const [selectedTab, setSelectedTab] = useState('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string>('');
  const [includeWorkLogs, setIncludeWorkLogs] = useState(true);
  const [includeTeamInfo, setIncludeTeamInfo] = useState(true);
  const [includeContactInfo, setIncludeContactInfo] = useState(true);
  const [includeCompanyInfo, setIncludeCompanyInfo] = useState(true);
  
  const handleGenerateProjectPDF = async () => {
    if (!selectedProjectId) {
      toast.error('Veuillez sélectionner un chantier');
      return;
    }
    
    const project = projectInfos.find(p => p.id === selectedProjectId);
    if (!project) return;
    
    const projectWorkLogs = includeWorkLogs 
      ? workLogs.filter(log => log.projectId === selectedProjectId)
      : [];
    
    try {
      const fileName = await generateProjectPDF(project, projectWorkLogs);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };
  
  const handleGenerateWorkLogPDF = async () => {
    if (!selectedWorkLogId) {
      toast.error('Veuillez sélectionner une fiche de suivi');
      return;
    }
    
    const workLog = workLogs.find(log => log.id === selectedWorkLogId);
    if (!workLog) return;
    
    const project = includeContactInfo ? getProjectById(workLog.projectId) : undefined;
    
    try {
      // Using the new generatePDF function with company info
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
  
  const handleGenerateReportPDF = async () => {
    try {
      const fileName = await generateReportPDF(projectInfos, workLogs);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="h-5 w-5" />
          Générateur de PDF
        </CardTitle>
        <CardDescription>
          Générez des rapports PDF pour vos chantiers et fiches de suivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settings.companyLogo && (
          <div className="mb-4 flex justify-center">
            <CompanyLogo className="h-16 w-auto" />
          </div>
        )}
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Chantiers</TabsTrigger>
            <TabsTrigger value="worklogs">Suivis</TabsTrigger>
            <TabsTrigger value="reports">Bilans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-2 pt-2">
              <Label htmlFor="project-select">Sélectionner un chantier</Label>
              <Select 
                value={selectedProjectId} 
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Choisir un chantier" />
                </SelectTrigger>
                <SelectContent>
                  {projectInfos.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-worklogs"
                  checked={includeWorkLogs}
                  onCheckedChange={(checked) => setIncludeWorkLogs(checked as boolean)}
                />
                <label 
                  htmlFor="include-worklogs"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Inclure les fiches de suivi
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-team-info"
                  checked={includeTeamInfo}
                  onCheckedChange={(checked) => setIncludeTeamInfo(checked as boolean)}
                />
                <label 
                  htmlFor="include-team-info"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Inclure les informations d'équipe
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-company-info-project"
                  checked={includeCompanyInfo}
                  onCheckedChange={(checked) => setIncludeCompanyInfo(checked as boolean)}
                />
                <label 
                  htmlFor="include-company-info-project"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Inclure les informations de l'entreprise
                </label>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateProjectPDF}
              disabled={!selectedProjectId}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Générer PDF
            </Button>
          </TabsContent>
          
          <TabsContent value="worklogs" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="pt-2 text-sm text-muted-foreground">
              Génère un rapport complet de tous les chantiers et suivis.
            </div>
            
            <Button 
              onClick={handleGenerateReportPDF}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Générer rapport complet
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFGenerator;

// Helper function for formatting date from WorkLogList
const formatDate = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
