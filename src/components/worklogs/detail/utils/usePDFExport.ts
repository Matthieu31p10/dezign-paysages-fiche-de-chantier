
import { useState } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { useSettingsContext } from '@/context/SettingsContext';
import { generatePDF, PDFOptions } from '@/utils/pdf';
import { toast } from 'sonner';

interface UsePDFExportProps {
  workLog: WorkLog;
  project?: ProjectInfo | null;
}

export const usePDFExport = ({ workLog, project }: UsePDFExportProps) => {
  const { settings } = useSettingsContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToPDF = async (options: PDFOptions & { theme?: string } = {}) => {
    if (!workLog) {
      toast.error("Impossible de générer le PDF sans données");
      return;
    }

    setIsExporting(true);

    try {
      const companyInfo = settings?.companyInfo;
      const companyLogo = settings?.companyLogo;

      const { theme, ...pdfOptions } = options;

      await generatePDF({
        workLog,
        project: project || undefined,
        companyInfo,
        companyLogo,
        pdfOptions,
        theme,
        action: 'download'
      });
      
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Une erreur est survenue lors de la génération du PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleExportToPDF,
    isExporting
  };
};
