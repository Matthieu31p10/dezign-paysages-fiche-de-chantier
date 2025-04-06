
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowLeft, Plus, List, FileIcon, Download } from 'lucide-react';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BlankWorkSheets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workLogs } = useWorkLogs();
  
  // Détecter le paramètre tab dans l'URL
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'list');
  
  // Compter les fiches vierges
  const blankWorkSheetsCount = workLogs.filter(log => log.projectId.startsWith('blank-')).length;
  
  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    const newUrl = `${location.pathname}?tab=${activeTab}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fiches Vierges</h1>
          <p className="text-muted-foreground">
            Créez et consultez des fiches pour des travaux ponctuels sans lien avec un chantier existant
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
        </div>
      </div>

      {blankWorkSheetsCount > 0 && (
        <Alert className="bg-muted">
          <FileIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Vous avez {blankWorkSheetsCount} fiche{blankWorkSheetsCount > 1 ? 's' : ''} vierge{blankWorkSheetsCount > 1 ? 's' : ''}. Ces fiches sont automatiquement incluses dans vos rapports statistiques mensuels.
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
            Nouvelle fiche
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="p-0 border-0 mt-6">
          <BlankWorkSheetList onCreateNew={() => setActiveTab('new')} />
        </TabsContent>
        
        <TabsContent value="new" className="p-0 border-0 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FilePlus className="w-5 h-5 mr-2 text-primary" />
                Nouvelle fiche vierge
              </CardTitle>
              <CardDescription>
                Créez une nouvelle fiche pour un travail ponctuel sans lien avec un projet existant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlankWorkSheetForm 
                onSuccess={() => {
                  toast.success("Fiche créée avec succès");
                  setActiveTab('list');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlankWorkSheets;
