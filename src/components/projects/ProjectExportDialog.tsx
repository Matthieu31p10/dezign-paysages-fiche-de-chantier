import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProjectInfo } from '@/types/models';
import { Download, FileText, FileSpreadsheet, Database } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectExportDialogProps {
  projects: ProjectInfo[];
  selectedProjects?: string[];
}

export const ProjectExportDialog: React.FC<ProjectExportDialogProps> = ({
  projects,
  selectedProjects = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'excel'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'clientName', 'address', 'projectType', 'team'
  ]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportFields = [
    { key: 'name', label: 'Nom du projet', required: true },
    { key: 'clientName', label: 'Nom du client' },
    { key: 'address', label: 'Adresse' },
    { key: 'projectType', label: 'Type de projet' },
    { key: 'team', label: 'Équipe' },
    { key: 'contact.name', label: 'Contact - Nom' },
    { key: 'contact.email', label: 'Contact - Email' },
    { key: 'contact.phone', label: 'Contact - Téléphone' },
    { key: 'irrigationType', label: 'Type d\'irrigation' },
    { key: 'mowerType', label: 'Type de tondeuse' },
    { key: 'annualVisits', label: 'Visites annuelles' },
    { key: 'annualTotalHours', label: 'Heures annuelles totales' },
    { key: 'visitDuration', label: 'Durée de visite' },
    { key: 'startDate', label: 'Date de début' },
    { key: 'endDate', label: 'Date de fin' },
    { key: 'contractDetails', label: 'Détails du contrat' },
    { key: 'additionalInfo', label: 'Informations supplémentaires' },
    { key: 'createdAt', label: 'Date de création' },
    { key: 'isArchived', label: 'Archivé' }
  ];

  const projectsToExport = selectedProjects.length > 0 
    ? projects.filter(p => selectedProjects.includes(p.id))
    : projects;

  const handleFieldToggle = (fieldKey: string) => {
    const field = exportFields.find(f => f.key === fieldKey);
    if (field?.required) return; // Can't uncheck required fields

    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const generateCSV = (data: any[]) => {
    const headers = selectedFields.map(field => 
      exportFields.find(f => f.key === field)?.label || field
    );
    
    const rows = data.map(project => 
      selectedFields.map(field => {
        const value = getNestedValue(project, field);
        return typeof value === 'string' ? `"${value}"` : value || '';
      })
    );

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const formatProjectData = (project: ProjectInfo) => {
    const data: any = { ...project };
    
    // Format dates
    if (data.startDate) data.startDate = new Date(data.startDate).toLocaleDateString();
    if (data.endDate) data.endDate = new Date(data.endDate).toLocaleDateString();
    if (data.createdAt) data.createdAt = new Date(data.createdAt).toLocaleDateString();
    
    // Format boolean
    data.isArchived = data.isArchived ? 'Oui' : 'Non';
    
    return data;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredProjects = includeArchived 
        ? projectsToExport 
        : projectsToExport.filter(p => !p.isArchived);

      const formattedData = filteredProjects.map(formatProjectData);

      let fileContent = '';
      let fileName = '';
      let mimeType = '';

      switch (exportFormat) {
        case 'csv':
          fileContent = generateCSV(formattedData);
          fileName = `projets_${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        
        case 'json':
          fileContent = JSON.stringify(formattedData, null, 2);
          fileName = `projets_${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        
        case 'excel':
          // For now, export as CSV (could be enhanced with a proper Excel library)
          fileContent = generateCSV(formattedData);
          fileName = `projets_${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
      }

      // Create and download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Export réussi: ${fileName}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'json':
        return <Database className="h-4 w-4" />;
      case 'excel':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
          {selectedProjects.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedProjects.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter les projets
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé de l'export */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Projets à exporter :</span>
              <Badge variant="secondary">
                {projectsToExport.length} projet{projectsToExport.length > 1 ? 's' : ''}
              </Badge>
            </div>
            {selectedProjects.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Export des projets sélectionnés
              </p>
            )}
          </div>

          {/* Format d'export */}
          <div className="space-y-2">
            <Label>Format d'export</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel, Google Sheets)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON (Données structurées)
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Excel (Format natif)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
                Inclure les projets archivés
              </Label>
            </div>
          </div>

          {/* Champs à exporter */}
          <div className="space-y-3">
            <Label>Champs à exporter</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedFields.length} champ{selectedFields.length > 1 ? 's' : ''} sélectionné{selectedFields.length > 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Export...' : (
                  <>
                    {getFormatIcon(exportFormat)}
                    <span className="ml-2">Exporter</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectExportDialog;