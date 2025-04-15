
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import { useApp } from '@/context/AppContext';
import { WorkLog } from '@/types/models';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

const BlankWorkSheets = () => {
  const navigate = useNavigate();
  const { workLogs } = useWorkLogs();
  const { projectInfos } = useApp();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Filter for blank sheets only
  const blankSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  const handleCreateNew = () => {
    // Create a unique ID for the blank sheet
    const blankId = `DZFV${Date.now()}`;
    navigate(`/worklogs/new?projectId=${blankId}&isBlankSheet=true`);
  };
  
  const handleEdit = (workLogId: string) => {
    navigate(`/worklogs/${workLogId}/edit`);
  };
  
  const handleExportPDF = async (id: string) => {
    try {
      setIsGeneratingPDF(true);
      const workLog = workLogs.find(log => log.id === id);
      
      if (!workLog) {
        toast.error("Fiche non trouvée");
        return;
      }
      
      // Get associated project if linked
      const project = workLog.linkedProjectId 
        ? projectInfos.find(p => p.id === workLog.linkedProjectId) 
        : null;
      
      await generatePDF(workLog);
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const handlePrint = async (id: string) => {
    try {
      setIsGeneratingPDF(true);
      const workLog = workLogs.find(log => log.id === id);
      
      if (!workLog) {
        toast.error("Fiche non trouvée");
        return;
      }
      
      // Get associated project if linked
      const project = workLog.linkedProjectId 
        ? projectInfos.find(p => p.id === workLog.linkedProjectId) 
        : null;
      
      await generatePDF(workLog);
      toast.success("Impression lancée");
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Erreur lors de l'impression");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fiches vierges</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches d'intervention hors contrat
          </p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche vierge
        </Button>
      </div>
      
      {blankSheets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune fiche vierge</CardTitle>
            <CardDescription>
              Vous n'avez pas encore créé de fiche vierge. Ces fiches sont utiles pour les interventions ponctuelles hors contrat.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button onClick={handleCreateNew} variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              Créer ma première fiche vierge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <BlankWorkSheetList 
              workLogs={blankSheets} 
              onCreateNew={handleCreateNew}
              onEdit={handleEdit}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlankWorkSheets;
