
import { useState } from 'react';
import { generatePDF } from '@/utils/pdf';
import { PDFOptions, PDFData } from '@/utils/pdf/types';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

export interface PDFGeneratorOptions extends PDFOptions {
  scale?: number;
  theme?: string;
}

export const usePDFGenerator = () => {
  const { workLogs } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('regular');
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string | null>(null);
  const [selectedBlankWorkLogId, setSelectedBlankWorkLogId] = useState<string | null>(null);
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true,
    includeWasteManagement: true,
  });

  const handleOptionChange = (option: keyof PDFOptions, value: boolean) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleGenerateWorkLogPDF = async (isBlank: boolean = false) => {
    const id = isBlank ? selectedBlankWorkLogId : selectedWorkLogId;
    if (!id) {
      toast.error('Sélectionnez une fiche de suivi');
      return;
    }

    const workLog = workLogs.find(wl => wl.id === id);
    if (!workLog) {
      toast.error('Fiche de suivi non trouvée');
      return;
    }

    await generateWorkLogPDF({ workLog }, { ...pdfOptions, theme: 'default' });
  };

  const generateWorkLogPDF = async (
    data: Omit<PDFData, 'pdfOptions'>,
    options: PDFGeneratorOptions = {}
  ) => {
    if (!data.workLog) {
      toast.error('Données manquantes pour générer le PDF');
      return;
    }

    try {
      setIsGenerating(true);

      const { scale, theme, ...pdfOptions } = options;

      // Prepare PDF data with options
      const pdfData: PDFData = {
        ...data,
        pdfOptions,
        theme,
        action: 'download',
      };

      await generatePDF(pdfData);
      toast.success('PDF généré avec succès');
    } catch (error) {
      toast.error('Échec de génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateWorkLogPDF,
    isGenerating,
    activeTab,
    setActiveTab,
    selectedWorkLogId,
    setSelectedWorkLogId,
    selectedBlankWorkLogId,
    setSelectedBlankWorkLogId,
    pdfOptions,
    handleOptionChange,
    handleGenerateWorkLogPDF
  };
};
