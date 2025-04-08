
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowLeft, Plus, List, FileIcon, Download, FileBarChart } from 'lucide-react';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProjects } from '@/context/ProjectsContext';

const BlankWorkSheets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workLogs, getWorkLogById } = useWorkLogs();
  const { getActiveProjects } = useProjects();
  
  // Détecter le paramètre tab dans l'URL
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'list');
  
  // État pour stocker l'ID de la fiche en cours d'édition
  const [editingWorkLogId, setEditingWorkLogId] = useState<string | null>(null);
  
  // Filter only blank worksheets
  const blankWorkSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  // Récupérer la liste des projets actifs
  const activeProjects = getActiveProjects();
  
  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    const newUrl = `${location.pathname}?tab=${activeTab}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser l'ID de la fiche en cours d'édition si on change d'onglet
    if (value !== 'new') {
      setEditingWorkLogId(null);
    }
  };
  
  // Gérer l'édition d'une fiche vierge
  const handleEditWorksheet = (workLogId: string) => {
    setEditingWorkLogId(workLogId);
    setActiveTab('new');
  };
  
  // Handle exporting PDF
  const handleExportPDF = (id: string) => {
    // Implement PDF export functionality
    toast.success("Export PDF en cours...");
  };
  
  // Handle printing
  const handlePrint = (id: string) => {
    // Implement print functionality
    toast.success("Impression en cours...");
  };
  
  // Gérer le succès du formulaire
  const handleFormSuccess = () => {
    toast.success(editingWorkLogId ? "Fiche modifiée avec succès" : "Fiche créée avec succès");
    setActiveTab('list');
    setEditingWorkLogId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fiches Vierges</h1>
          <p className="text-muted-foreground">
            Créez et consultez des fiches pour des travaux ponctuels sans lien avec un chantier existant, ou des travaux complémentaires sur des chantiers existants
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/worklogs')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voir les fiches de suivi
          </Button>
          
          <Button
            onClick={() => navigate('/projects')}
            variant="outline"
          >
            <FileBarChart className="w-4 h-4 mr-2" />
            Voir les projets
          </Button>
        </div>
      </div>

      {blankWorkSheets.length > 0 && (
        <Alert className="bg-muted">
          <FileIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Vous avez {blankWorkSheets.length} fiche{blankWorkSheets.length > 1 ? 's' : ''} vierge{blankWorkSheets.length > 1 ? 's' : ''}. Ces fiches sont automatiquement incluses dans vos rapports statistiques mensuels.
            {activeProjects.length > 0 && (
              <span className="block mt-1">
                Vous pouvez désormais associer vos fiches vierges à des projets existants lors de l'export en PDF.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="list" className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            Liste des fiches
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            {editingWorkLogId ? "Modifier la fiche" : "Nouvelle fiche"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="p-0 border-0 mt-6">
          <BlankWorkSheetList 
            sheets={blankWorkSheets}
            onCreateNew={() => {
              setEditingWorkLogId(null);
              setActiveTab('new');
            }}
            onEdit={handleEditWorksheet}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />
        </TabsContent>
        
        <TabsContent value="new" className="p-0 border-0 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FilePlus className="w-5 h-5 mr-2 text-primary" />
                {editingWorkLogId ? "Modifier la fiche vierge" : "Nouvelle fiche vierge"}
              </CardTitle>
              <CardDescription>
                {editingWorkLogId 
                  ? "Modifiez les détails de votre fiche"
                  : "Créez une nouvelle fiche pour un travail ponctuel sans lien avec un projet existant, ou pour des travaux complémentaires sur un chantier existant"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlankWorkSheetForm 
                workLogId={editingWorkLogId}
                onSuccess={handleFormSuccess}
                key={editingWorkLogId || 'new'} // Ajout d'une key pour forcer le rechargement complet lors de l'édition
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlankWorkSheets;
