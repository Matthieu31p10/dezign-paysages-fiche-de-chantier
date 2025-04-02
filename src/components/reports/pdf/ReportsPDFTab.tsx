
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { generateReportPDF } from '@/utils/pdf';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const ReportsPDFTab = () => {
  const { projectInfos, workLogs } = useApp();
  
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
    <div className="space-y-4">
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
    </div>
  );
};

export default ReportsPDFTab;
