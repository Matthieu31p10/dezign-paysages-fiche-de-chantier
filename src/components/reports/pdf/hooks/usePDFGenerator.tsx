
import { useState } from 'react';
import { generatePDF, PDFOptions, PDFData } from '@/utils/pdf';
import { toast } from 'sonner';

export interface PDFGeneratorOptions extends PDFOptions {
  scale?: number;
  theme?: string;
}

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

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
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Échec de génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateWorkLogPDF,
    isGenerating
  };
};
