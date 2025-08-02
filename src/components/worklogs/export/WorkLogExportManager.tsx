import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkLog } from '@/types/models';
import { Download, FileText, Table, Calendar, Settings, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface WorkLogExportManagerProps {
  workLogs: WorkLog[];
}

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: 'custom' | 'current-month' | 'last-month' | 'current-year' | 'last-year';
  startDate: string;
  endDate: string;
  includeFinancials: boolean;
  includeConsumables: boolean;
  includeTimeTracking: boolean;
  includeNotes: boolean;
  groupBy: 'project' | 'date' | 'team' | 'none';
  template: 'detailed' | 'summary' | 'financial' | 'custom';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<ExportConfig>;
}

export const WorkLogExportManager: React.FC<WorkLogExportManagerProps> = ({
  workLogs
}) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    dateRange: 'current-month',
    startDate: '',
    endDate: '',
    includeFinancials: true,
    includeConsumables: true,
    includeTimeTracking: true,
    includeNotes: false,
    groupBy: 'project',
    template: 'detailed'
  });

  const [isExporting, setIsExporting] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'detailed',
      name: 'Rapport détaillé',
      description: 'Rapport complet avec toutes les informations',
      config: {
        includeFinancials: true,
        includeConsumables: true,
        includeTimeTracking: true,
        includeNotes: true,
        groupBy: 'project'
      }
    },
    {
      id: 'summary',
      name: 'Résumé exécutif',
      description: 'Vue d\'ensemble des métriques principales',
      config: {
        includeFinancials: true,
        includeConsumables: false,
        includeTimeTracking: true,
        includeNotes: false,
        groupBy: 'none'
      }
    },
    {
      id: 'financial',
      name: 'Rapport financier',
      description: 'Focus sur les aspects financiers',
      config: {
        includeFinancials: true,
        includeConsumables: true,
        includeTimeTracking: false,
        includeNotes: false,
        groupBy: 'project'
      }
    }
  ];

  const quickExports = [
    {
      id: 'monthly-summary',
      name: 'Résumé mensuel',
      icon: Calendar,
      config: { dateRange: 'current-month' as const, template: 'summary' as const, format: 'pdf' as const }
    },
    {
      id: 'financial-report',
      name: 'Rapport financier',
      icon: FileText,
      config: { dateRange: 'current-month' as const, template: 'financial' as const, format: 'pdf' as const }
    },
    {
      id: 'data-export',
      name: 'Export données',
      icon: Table,
      config: { dateRange: 'current-year' as const, template: 'detailed' as const, format: 'excel' as const }
    },
    {
      id: 'time-tracking',
      name: 'Suivi du temps',
      icon: Clock,
      config: { dateRange: 'current-month' as const, template: 'detailed' as const, format: 'csv' as const, groupBy: 'date' as const }
    }
  ];

  const getFilteredWorkLogs = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (exportConfig.dateRange) {
      case 'current-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'current-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case 'last-year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'custom':
        startDate = new Date(exportConfig.startDate);
        endDate = new Date(exportConfig.endDate);
        break;
      default:
        return workLogs;
    }

    return workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
  };

  const calculateExportStats = () => {
    const filteredLogs = getFilteredWorkLogs();
    const totalRevenue = filteredLogs.reduce((sum, log) => {
      const hourlyRate = log.hourlyRate || 45;
      const personnel = log.personnel?.length || 1;
      const hours = log.timeTracking?.totalHours || 0;
      return sum + (hourlyRate * hours * personnel);
    }, 0);

    const totalHours = filteredLogs.reduce((sum, log) => {
      const personnel = log.personnel?.length || 1;
      const hours = log.timeTracking?.totalHours || 0;
      return sum + (hours * personnel);
    }, 0);

    return {
      logsCount: filteredLogs.length,
      totalRevenue,
      totalHours,
      uniqueProjects: new Set(filteredLogs.map(log => log.projectId)).size
    };
  };

  const generateExport = async (config: Partial<ExportConfig> = {}) => {
    const finalConfig = { ...exportConfig, ...config };
    setIsExporting(true);

    try {
      const filteredLogs = getFilteredWorkLogs();
      const stats = calculateExportStats();

      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const exportData = {
        config: finalConfig,
        data: filteredLogs,
        stats,
        generatedAt: new Date().toISOString()
      };

      // Create and download file based on format
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (finalConfig.format) {
        case 'pdf':
          content = JSON.stringify(exportData, null, 2);
          filename = `worklog-report-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'excel':
          content = generateExcelContent(filteredLogs, finalConfig);
          filename = `worklog-data-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'csv':
          content = generateCSVContent(filteredLogs, finalConfig);
          filename = `worklog-export-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          content = JSON.stringify(exportData, null, 2);
          filename = `worklog-export-${Date.now()}.json`;
          mimeType = 'application/json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Export ${finalConfig.format?.toUpperCase()} généré avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la génération de l\'export');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVContent = (logs: WorkLog[], config: ExportConfig): string => {
    const headers = ['Date', 'Projet', 'Personnel', 'Heures'];
    
    if (config.includeFinancials) {
      headers.push('Taux horaire', 'Revenus');
    }
    
    if (config.includeConsumables) {
      headers.push('Coût consommables');
    }
    
    if (config.includeNotes) {
      headers.push('Notes');
    }

    const rows = logs.map(log => {
      const row = [
        log.date,
        log.projectId,
        log.personnel?.join(', ') || '',
        (log.timeTracking?.totalHours || 0).toString()
      ];

      if (config.includeFinancials) {
        const hourlyRate = log.hourlyRate || 45;
        const revenue = (log.timeTracking?.totalHours || 0) * hourlyRate * (log.personnel?.length || 1);
        row.push(hourlyRate.toString(), revenue.toString());
      }

      if (config.includeConsumables) {
        const consumablesCost = log.consumables?.reduce((sum, c) => sum + c.totalPrice, 0) || 0;
        row.push(consumablesCost.toString());
      }

      if (config.includeNotes) {
        row.push(log.notes || '');
      }

      return row;
    });

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const generateExcelContent = (logs: WorkLog[], config: ExportConfig): string => {
    return generateCSVContent(logs, config);
  };

  const applyTemplate = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setExportConfig(prev => ({ ...prev, ...template.config, template: templateId as any }));
    }
  };

  const stats = calculateExportStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export & Rapports</h2>
          <p className="text-muted-foreground">
            Génération de rapports et exports de données
          </p>
        </div>
      </div>

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exports rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickExports.map((exportItem) => (
              <Button
                key={exportItem.id}
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => generateExport(exportItem.config)}
                disabled={isExporting}
              >
                <exportItem.icon className="h-6 w-6" />
                <span className="text-sm">{exportItem.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Configuration */}
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="schedule">Planification</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration de l'export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format & Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Format d'export</Label>
                    <Select 
                      value={exportConfig.format} 
                      onValueChange={(value: 'pdf' | 'excel' | 'csv') => 
                        setExportConfig(prev => ({ ...prev, format: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Période</Label>
                    <Select 
                      value={exportConfig.dateRange} 
                      onValueChange={(value: any) => 
                        setExportConfig(prev => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Mois actuel</SelectItem>
                        <SelectItem value="last-month">Mois dernier</SelectItem>
                        <SelectItem value="current-year">Année actuelle</SelectItem>
                        <SelectItem value="last-year">Année dernière</SelectItem>
                        <SelectItem value="custom">Personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Date Range */}
                {exportConfig.dateRange === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input
                        type="date"
                        value={exportConfig.startDate}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input
                        type="date"
                        value={exportConfig.endDate}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {/* Content Options */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Contenu à inclure</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="financials"
                        checked={exportConfig.includeFinancials}
                        onCheckedChange={(checked) => 
                          setExportConfig(prev => ({ ...prev, includeFinancials: !!checked }))
                        }
                      />
                      <Label htmlFor="financials">Données financières</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consumables"
                        checked={exportConfig.includeConsumables}
                        onCheckedChange={(checked) => 
                          setExportConfig(prev => ({ ...prev, includeConsumables: !!checked }))
                        }
                      />
                      <Label htmlFor="consumables">Consommables</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="timeTracking"
                        checked={exportConfig.includeTimeTracking}
                        onCheckedChange={(checked) => 
                          setExportConfig(prev => ({ ...prev, includeTimeTracking: !!checked }))
                        }
                      />
                      <Label htmlFor="timeTracking">Suivi du temps</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notes"
                        checked={exportConfig.includeNotes}
                        onCheckedChange={(checked) => 
                          setExportConfig(prev => ({ ...prev, includeNotes: !!checked }))
                        }
                      />
                      <Label htmlFor="notes">Notes</Label>
                    </div>
                  </div>
                </div>

                {/* Grouping */}
                <div className="space-y-2">
                  <Label>Grouper par</Label>
                  <Select 
                    value={exportConfig.groupBy} 
                    onValueChange={(value: any) => 
                      setExportConfig(prev => ({ ...prev, groupBy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun groupement</SelectItem>
                      <SelectItem value="project">Par projet</SelectItem>
                      <SelectItem value="date">Par date</SelectItem>
                      <SelectItem value="team">Par équipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={() => generateExport()} 
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? 'Génération en cours...' : 'Générer l\'export'}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu de l'export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fiches</span>
                    <span className="font-medium">{stats.logsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenus</span>
                    <span className="font-medium">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Heures</span>
                    <span className="font-medium">{stats.totalHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projets</span>
                    <span className="font-medium">{stats.uniqueProjects}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Format: <span className="font-medium">{exportConfig.format.toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Période: <span className="font-medium">{exportConfig.dateRange}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => applyTemplate(template.id)}
                    variant="outline" 
                    className="w-full"
                  >
                    Utiliser ce template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planification d'exports automatiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Fonctionnalité à venir</h3>
                <p className="text-muted-foreground">
                  La planification d'exports automatiques sera disponible dans une prochaine version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};