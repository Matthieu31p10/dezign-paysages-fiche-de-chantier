import React, { useState, useCallback } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Upload, 
  Database, 
  FileText, 
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useProjectDataValidation } from '@/hooks/useProjectDataValidation';
import { useProjectSync } from '@/hooks/useProjectSync';
import { projectDataHelpers } from '@/utils/projectDataHelpers';
import { DataIntegrityPanel } from './DataIntegrityPanel';
import { toast } from 'sonner';

interface ProjectDataManagerProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  onProjectsUpdate: (projects: ProjectInfo[]) => void;
  onWorkLogsUpdate: (workLogs: WorkLog[]) => void;
}

export const ProjectDataManager: React.FC<ProjectDataManagerProps> = ({
  projects,
  workLogs,
  onProjectsUpdate,
  onWorkLogsUpdate
}) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const { validateProject, validateBeforeSave } = useProjectDataValidation();
  const { syncStatus, syncPendingChanges } = useProjectSync();

  // Export functions
  const handleExportCSV = useCallback(() => {
    try {
      const csvContent = projectDataHelpers.exportToCSV(projects, workLogs);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `projets_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Export CSV réussi');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export CSV');
    }
  }, [projects, workLogs]);

  const handleExportBackup = useCallback(() => {
    try {
      const backup = projectDataHelpers.createBackup(projects, workLogs);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sauvegarde_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Sauvegarde créée avec succès');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  }, [projects, workLogs]);

  // Import functions
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportProgress(0);
      setValidationResults([]);
      setShowValidation(false);
    }
  }, []);

  const handleImportCSV = useCallback(async () => {
    if (!importFile) return;

    try {
      setImportProgress(10);
      
      const content = await importFile.text();
      setImportProgress(30);
      
      const importedProjects = projectDataHelpers.importFromCSV(content);
      setImportProgress(50);
      
      // Validate imported projects
      const validationResults = importedProjects.map((project, index) => {
        const validation = validateProject(project);
        return {
          index,
          project,
          validation,
          name: project.name || `Projet ${index + 1}`
        };
      });
      
      setValidationResults(validationResults);
      setImportProgress(80);
      
      const validProjects = validationResults
        .filter(result => result.validation.isValid)
        .map(result => result.project as ProjectInfo);
      
      if (validProjects.length > 0) {
        // Generate unique names for duplicates
        const updatedProjects = validProjects.map(project => ({
          ...project,
          name: projectDataHelpers.generateUniqueProjectName(project.name || 'Nouveau projet', projects)
        }));
        
        onProjectsUpdate([...projects, ...updatedProjects]);
        setImportProgress(100);
        
        toast.success(`${validProjects.length} projet(s) importé(s) avec succès`);
        
        if (validationResults.some(r => !r.validation.isValid)) {
          setShowValidation(true);
          toast.warning('Certains projets ont des erreurs de validation');
        }
      } else {
        toast.error('Aucun projet valide trouvé dans le fichier');
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur lors de l\'import');
      setImportProgress(0);
    }
  }, [importFile, projects, onProjectsUpdate, validateProject]);

  const handleImportBackup = useCallback(async () => {
    if (!importFile) return;

    try {
      setImportProgress(10);
      
      const content = await importFile.text();
      const backupData = JSON.parse(content);
      setImportProgress(50);
      
      const restored = projectDataHelpers.restoreFromBackup(backupData);
      
      if (restored) {
        onProjectsUpdate(restored.projects);
        onWorkLogsUpdate(restored.workLogs);
        setImportProgress(100);
        toast.success('Sauvegarde restaurée avec succès');
      } else {
        toast.error('Format de sauvegarde invalide');
      }
      
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Erreur lors de la restauration');
      setImportProgress(0);
    }
  }, [importFile, onProjectsUpdate, onWorkLogsUpdate]);

  // Validation functions
  const runFullValidation = useCallback(() => {
    const results = projects.map((project, index) => {
      const validation = validateProject(project);
      return {
        index,
        project,
        validation,
        name: project.name
      };
    });
    
    setValidationResults(results);
    setShowValidation(true);
    
    const invalidCount = results.filter(r => !r.validation.isValid).length;
    if (invalidCount === 0) {
      toast.success('Tous les projets sont valides');
    } else {
      toast.warning(`${invalidCount} projet(s) avec des erreurs`);
    }
  }, [projects, validateProject]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestionnaire de données
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="integrity">Intégrité</TabsTrigger>
            </TabsList>
            
            {/* Export Tab */}
            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4" />
                      <h4 className="font-medium">Export CSV</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Exporter tous les projets au format CSV
                    </p>
                    <Button onClick={handleExportCSV} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger CSV
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4" />
                      <h4 className="font-medium">Sauvegarde complète</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Créer une sauvegarde de toutes les données
                    </p>
                    <Button onClick={handleExportBackup} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Créer sauvegarde
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Import Tab */}
            <TabsContent value="import" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import-file">Sélectionner un fichier</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                </div>
                
                {importFile && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {importFile.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {(importFile.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        
                        {importProgress > 0 && (
                          <Progress value={importProgress} className="w-full" />
                        )}
                        
                        <div className="flex gap-2">
                          {importFile.name.endsWith('.csv') && (
                            <Button onClick={handleImportCSV} disabled={importProgress > 0}>
                              <Upload className="h-4 w-4 mr-2" />
                              Importer CSV
                            </Button>
                          )}
                          
                          {importFile.name.endsWith('.json') && (
                            <Button onClick={handleImportBackup} disabled={importProgress > 0}>
                              <Upload className="h-4 w-4 mr-2" />
                              Restaurer sauvegarde
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            {/* Validation Tab */}
            <TabsContent value="validation" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Validation des données</h4>
                <Button onClick={runFullValidation}>
                  <Shield className="h-4 w-4 mr-2" />
                  Valider tout
                </Button>
              </div>
              
              {showValidation && validationResults.length > 0 && (
                <div className="space-y-2">
                  {validationResults.map((result, index) => (
                    <Alert 
                      key={index}
                      variant={result.validation.isValid ? 'default' : 'destructive'}
                    >
                      {result.validation.isValid ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{result.name}</p>
                            {!result.validation.isValid && (
                              <div className="mt-1 space-y-1">
                                {Object.values(result.validation.errors).map((error: any, i) => (
                                  <p key={i} className="text-sm">• {error}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Integrity Tab */}
            <TabsContent value="integrity">
              <DataIntegrityPanel
                projects={projects}
                workLogs={workLogs}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};