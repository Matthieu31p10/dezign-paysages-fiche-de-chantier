import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Download, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { PassageCalendar } from './PassageCalendar';
import { OverdueProjectAlerts } from './OverdueProjectAlerts';
import { exportPassagesToPDF } from '@/utils/pdfExport';

interface AdvancedPassageFeaturesProps {
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
  onProjectSelect?: (projectId: string) => void;
  currentFilters?: {
    selectedProject?: string;
    selectedTeam?: string;
    searchQuery?: string;
    periodFilter?: string;
  };
}

export const AdvancedPassageFeatures: React.FC<AdvancedPassageFeaturesProps> = ({
  passages,
  getProjectName,
  onProjectSelect,
  currentFilters
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeView, setActiveView] = useState<'alerts' | 'calendar'>('alerts');

  const handlePDFExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportPassagesToPDF(passages, getProjectName, currentFilters);
      
      if (result.success) {
        toast.success(`PDF exporté avec succès: ${result.fileName}`);
      } else {
        toast.error(result.error || 'Erreur lors de l\'export PDF');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePassageClick = (passage: WorkLog) => {
    // Pour l'instant, on peut juste montrer une notification
    // Plus tard, cela pourrait ouvrir un modal de détails
    toast.info(`Passage du ${new Date(passage.date).toLocaleDateString()} sur ${getProjectName(passage.projectId)}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons d'action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'alerts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('alerts')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Alertes
          </Button>
          <Button
            variant={activeView === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendrier
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Button
            variant="outline"
            size="sm"
            onClick={handlePDFExport}
            disabled={isExporting || passages.length === 0}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Contenu dynamique */}
      {activeView === 'alerts' ? (
        <OverdueProjectAlerts
          passages={passages}
          getProjectName={getProjectName}
          onProjectSelect={onProjectSelect}
        />
      ) : (
        <PassageCalendar
          passages={passages}
          getProjectName={getProjectName}
          onPassageClick={handlePassageClick}
        />
      )}

      {/* Information sur l'export PDF */}
      {passages.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune donnée disponible pour l'export</p>
        </div>
      )}
    </div>
  );
};