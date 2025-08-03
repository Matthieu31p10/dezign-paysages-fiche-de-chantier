
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { generateProjectPDF } from '@/utils/pdf';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const ProjectsPDFTab = () => {
  const { projectInfos, workLogs } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [includeWorkLogs, setIncludeWorkLogs] = useState(true);
  const [includeTeamInfo, setIncludeTeamInfo] = useState(true);
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
    }
  };
  
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ProjectsPDFTab;
