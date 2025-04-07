
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
import { BlankWorkSheetValues } from '@/components/worksheets/schema';
import { extractAddress, extractClientName, extractDescription, extractEmail, extractHourlyRate, extractLinkedProjectId, extractPhone, extractVatRate, extractAdditionalNotes, extractSignedQuote } from '@/utils/helpers';
import { WorkLog } from '@/types/models';

const BlankWorkSheets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workLogs } = useWorkLogs();
  const { getActiveProjects } = useProjects();
  
  // Détecter le paramètre tab dans l'URL
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'list');
  
  // État pour stocker la fiche à éditer
  const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null);
  
  // Compter les fiches vierges
  const blankWorkSheetsCount = workLogs.filter(log => log.projectId.startsWith('blank-')).length;
  
  // Récupérer la liste des projets actifs
  const activeProjects = getActiveProjects();
  
  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    const newUrl = `${location.pathname}?tab=${activeTab}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser la fiche en cours d'édition si on change d'onglet
    if (value !== 'new') {
      setEditingWorkLog(null);
    }
  };

  // Préparer les données de la fiche pour l'édition
  const prepareWorkSheetForEditing = (workLogId: string) => {
    const workLog = workLogs.find(log => log.id === workLogId);
    if (workLog) {
      setEditingWorkLog(workLog);
      setActiveTab('new');
    } else {
      toast.error("Fiche non trouvée");
    }
  };

  // Convertir les données de la fiche en valeurs pour le formulaire
  const getInitialFormValues = (): Partial<BlankWorkSheetValues> => {
    if (!editingWorkLog) return {};

    // Extraire les informations du champ notes
    const clientName = extractClientName(editingWorkLog.notes || '');
    const address = extractAddress(editingWorkLog.notes || '');
    const contactPhone = extractPhone(editingWorkLog.notes || '');
    const contactEmail = extractEmail(editingWorkLog.notes || '');
    const linkedProjectId = extractLinkedProjectId(editingWorkLog.notes || '');
    const workDescription = extractDescription(editingWorkLog.notes || '');
    const notes = extractAdditionalNotes(editingWorkLog.notes || '');
    const vatRate = extractVatRate(editingWorkLog.notes || '');
    const hourlyRate = extractHourlyRate(editingWorkLog.notes || '');
    const signedQuote = extractSignedQuote(editingWorkLog.notes || '');
    
    return {
      clientName,
      address,
      contactPhone,
      contactEmail,
      linkedProjectId: linkedProjectId || '',
      date: new Date(editingWorkLog.date),
      workDescription,
      notes,
      personnel: editingWorkLog.personnel,
      departure: editingWorkLog.timeTracking.departure,
      arrival: editingWorkLog.timeTracking.arrival,
      end: editingWorkLog.timeTracking.end,
      breakTime: editingWorkLog.timeTracking.breakTime,
      totalHours: editingWorkLog.timeTracking.totalHours,
      hourlyRate,
      wasteManagement: editingWorkLog.wasteManagement || 'none',
      consumables: editingWorkLog.consumables || [],
      vatRate: vatRate as "10" | "20",
      signedQuote
    };
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

      {blankWorkSheetsCount > 0 && (
        <Alert className="bg-muted">
          <FileIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Vous avez {blankWorkSheetsCount} fiche{blankWorkSheetsCount > 1 ? 's' : ''} vierge{blankWorkSheetsCount > 1 ? 's' : ''}. Ces fiches sont automatiquement incluses dans vos rapports statistiques mensuels.
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
            {editingWorkLog ? 'Modifier la fiche' : 'Nouvelle fiche'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="p-0 border-0 mt-6">
          <BlankWorkSheetList 
            onCreateNew={() => {
              setEditingWorkLog(null);
              setActiveTab('new');
            }}
            onEdit={prepareWorkSheetForEditing}
          />
        </TabsContent>
        
        <TabsContent value="new" className="p-0 border-0 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FilePlus className="w-5 h-5 mr-2 text-primary" />
                {editingWorkLog ? 'Modifier la fiche' : 'Nouvelle fiche vierge'}
              </CardTitle>
              <CardDescription>
                {editingWorkLog 
                  ? 'Modifiez les détails de cette fiche de travail'
                  : 'Créez une nouvelle fiche pour un travail ponctuel sans lien avec un projet existant, ou pour des travaux complémentaires sur un chantier existant'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlankWorkSheetForm 
                onSuccess={() => {
                  toast.success(editingWorkLog ? "Fiche mise à jour avec succès" : "Fiche créée avec succès");
                  setEditingWorkLog(null);
                  setActiveTab('list');
                }}
                initialValues={getInitialFormValues()}
                workLogId={editingWorkLog?.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlankWorkSheets;
