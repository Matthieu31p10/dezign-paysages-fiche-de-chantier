import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectInfo } from '@/types/models';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useProjects } from '@/context/ProjectsContext';

interface ProjectExcelManagerProps {
  projects: ProjectInfo[];
  selectedProjects?: string[];
}

interface ImportResult {
  successful: ProjectInfo[];
  errors: { row: number; error: string; data: any }[];
}

export const ProjectExcelManager: React.FC<ProjectExcelManagerProps> = ({
  projects,
  selectedProjects = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('export');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'clientName', 'address', 'projectType', 'team'
  ]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addProjectInfo } = useProjects();

  const exportFields = [
    { key: 'name', label: 'Nom du projet', required: true },
    { key: 'clientName', label: 'Nom du client' },
    { key: 'address', label: 'Adresse' },
    { key: 'projectType', label: 'Type de projet' },
    { key: 'team', label: 'Équipe' },
    { key: 'contactPhone', label: 'Contact - Téléphone' },
    { key: 'contactEmail', label: 'Contact - Email' },
    { key: 'contact.name', label: 'Contact - Nom détaillé' },
    { key: 'irrigation', label: 'Type d\'irrigation' },
    { key: 'mowerType', label: 'Type de tondeuse' },
    { key: 'annualVisits', label: 'Visites annuelles' },
    { key: 'annualTotalHours', label: 'Heures annuelles totales' },
    { key: 'visitDuration', label: 'Durée de visite' },
    { key: 'startDate', label: 'Date de début' },
    { key: 'endDate', label: 'Date de fin' },
    { key: 'contract.details', label: 'Détails du contrat' },
    { key: 'additionalInfo', label: 'Informations supplémentaires' },
    { key: 'createdAt', label: 'Date de création' },
    { key: 'isArchived', label: 'Archivé' }
  ];

  const projectsToExport = selectedProjects.length > 0 
    ? projects.filter(p => selectedProjects.includes(p.id))
    : projects;

  const handleFieldToggle = (fieldKey: string) => {
    const field = exportFields.find(f => f.key === fieldKey);
    if (field?.required) return;

    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const formatProjectForExport = (project: ProjectInfo) => {
    const formattedProject: any = {};
    
    selectedFields.forEach(fieldKey => {
      const field = exportFields.find(f => f.key === fieldKey);
      if (!field) return;
      
      let value: any;
      
      // Handle nested properties
      if (fieldKey.includes('.')) {
        const keys = fieldKey.split('.');
        value = keys.reduce((obj, key) => obj?.[key], project);
      } else {
        value = project[fieldKey as keyof ProjectInfo];
      }
      
      // Format specific fields
      if (fieldKey === 'startDate' || fieldKey === 'endDate' || fieldKey === 'createdAt') {
        value = value ? new Date(value as Date).toLocaleDateString('fr-FR') : '';
      } else if (fieldKey === 'isArchived') {
        value = value ? 'Oui' : 'Non';
      }
      
      formattedProject[field.label] = value || '';
    });
    
    return formattedProject;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredProjects = includeArchived 
        ? projectsToExport 
        : projectsToExport.filter(p => !p.isArchived);

      const formattedData = filteredProjects.map(formatProjectForExport);

      // Créer un nouveau workbook Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData);

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Chantiers');

      // Générer le fichier et le télécharger
      const fileName = `chantiers_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success(`Export Excel réussi: ${fileName}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Erreur lors de l\'export Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    handleImport(file);
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const result: ImportResult = {
        successful: [],
        errors: []
      };

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as any;
        const rowNumber = i + 2; // +2 car ligne 1 = headers
        
        try {
          // Validation des champs requis
          if (!row['Nom du projet']) {
            result.errors.push({
              row: rowNumber,
              error: 'Le nom du projet est requis',
              data: row
            });
            continue;
          }

          // Mapper les données Excel vers le format ProjectInfo
          const projectData: Omit<ProjectInfo, 'id' | 'createdAt'> = {
            name: row['Nom du projet'] || '',
            clientName: row['Nom du client'] || '',
            address: row['Adresse'] || '',
            projectType: (row['Type de projet'] || '') as 'residence' | 'particular' | 'enterprise' | 'ponctuel' | '',
            team: row['Équipe'] || '',
            contactPhone: row['Contact - Téléphone'] || '',
            contactEmail: row['Contact - Email'] || '',
            contact: {
              name: row['Contact - Nom détaillé'] || '',
              email: row['Contact - Email'] || '',
              phone: row['Contact - Téléphone'] || ''
            },
            contract: {
              details: row['Détails du contrat'] || '',
              documentUrl: ''
            },
            irrigation: (row['Type d\'irrigation'] || '') as 'irrigation' | 'none' | 'disabled' | undefined,
            mowerType: (row['Type de tondeuse'] || '') as 'large' | 'small' | 'both' | undefined,
            annualVisits: Number(row['Visites annuelles']) || 0,
            annualTotalHours: Number(row['Heures annuelles totales']) || 0,
            visitDuration: Number(row['Durée de visite']) || 0,
            startDate: row['Date de début'] ? new Date(row['Date de début']) : null,
            endDate: row['Date de fin'] ? new Date(row['Date de fin']) : null,
            additionalInfo: row['Informations supplémentaires'] || '',
            isArchived: row['Archivé'] === 'Oui',
            teams: [],
            documents: []
          };

          // Ajouter le projet
          const newProject = await addProjectInfo(projectData);
          result.successful.push(newProject);
          
        } catch (error) {
          result.errors.push({
            row: rowNumber,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            data: row
          });
        }
      }

      setImportResult(result);
      
      if (result.successful.length > 0) {
        toast.success(`${result.successful.length} chantier(s) importé(s) avec succès`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erreur(s) lors de l'import`);
      }

    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Erreur lors de l\'import du fichier Excel');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Nom du projet': 'Exemple - Jardin Municipal',
        'Nom du client': 'Mairie de Ville',
        'Adresse': '123 Rue de la Paix, 12345 Ville',
        'Type de projet': 'enterprise',
        'Équipe': 'Équipe A',
        'Contact - Téléphone': '01 23 45 67 89',
        'Contact - Email': 'jean.dupont@mairie.fr',
        'Contact - Nom détaillé': 'Jean Dupont',
        'Type d\'irrigation': 'irrigation',
        'Type de tondeuse': 'large',
        'Visites annuelles': 12,
        'Heures annuelles totales': 48,
        'Durée de visite': 4,
        'Date de début': '01/01/2024',
        'Date de fin': '31/12/2024',
        'Détails du contrat': 'Contrat d\'entretien annuel',
        'Informations supplémentaires': 'Attention aux zones sensibles',
        'Archivé': 'Non'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_chantiers.xlsx');
    
    toast.success('Modèle Excel téléchargé');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
          {selectedProjects.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedProjects.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Gestion Excel des Chantiers
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            {/* Résumé de l'export */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Chantiers à exporter :</span>
                <Badge variant="secondary">
                  {projectsToExport.length} chantier{projectsToExport.length > 1 ? 's' : ''}
                </Badge>
              </div>
              {selectedProjects.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Export des chantiers sélectionnés
                </p>
              )}
            </div>

            {/* Options d'export */}
            <div className="space-y-3">
              <Label>Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-archived"
                  checked={includeArchived}
                  onCheckedChange={(checked) => setIncludeArchived(checked === true)}
                />
                <Label htmlFor="include-archived" className="text-sm">
                  Inclure les chantiers archivés
                </Label>
              </div>
            </div>

            {/* Champs à exporter */}
            <div className="space-y-3">
              <Label>Champs à exporter</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                {exportFields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields.includes(field.key)}
                      onCheckedChange={() => handleFieldToggle(field.key)}
                      disabled={field.required}
                    />
                    <Label 
                      htmlFor={field.key} 
                      className={`text-sm ${field.required ? 'font-medium' : ''}`}
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                * Champs obligatoires
              </p>
            </div>

            {/* Actions Export */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedFields.length} champ{selectedFields.length > 1 ? 's' : ''} sélectionné{selectedFields.length > 1 ? 's' : ''}
              </div>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Export en cours...' : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter vers Excel
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium mb-2">Comment importer des chantiers :</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Téléchargez le modèle Excel ci-dessous</li>
                <li>2. Remplissez vos données dans le modèle</li>
                <li>3. Sélectionnez votre fichier pour l'import</li>
              </ol>
            </div>

            {/* Télécharger le modèle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Modèle Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Téléchargez le modèle avec les colonnes correctes
                </p>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le modèle
              </Button>
            </div>

            {/* Import de fichier */}
            <div className="space-y-3">
              <Label>Importer un fichier Excel</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Sélectionnez un fichier Excel (.xlsx, .xls)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                >
                  {isImporting ? 'Import en cours...' : 'Sélectionner un fichier'}
                </Button>
              </div>
            </div>

            {/* Résultats d'import */}
            {importResult && (
              <div className="space-y-4">
                <h3 className="font-medium">Résultats de l'import</h3>
                
                {/* Succès */}
                {importResult.successful.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {importResult.successful.length} chantier(s) importé(s) avec succès
                      </span>
                    </div>
                  </div>
                )}

                {/* Erreurs */}
                {importResult.errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">
                        {importResult.errors.length} erreur(s) détectée(s)
                      </span>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 mb-1">
                          Ligne {error.row}: {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions générales */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectExcelManager;