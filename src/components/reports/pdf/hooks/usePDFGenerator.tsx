
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useLocation } from 'react-router-dom';
import { generatePDF } from '@/utils/pdf';
import { toast } from 'sonner';
import { PDFOptions } from '../types';

export const usePDFGenerator = () => {
  const { workLogs, getProjectById, settings } = useApp();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const generateType = queryParams.get('generate');
  const generateId = queryParams.get('id');
  
  const [activeTab, setActiveTab] = useState<string>(generateType === 'blank' ? 'blank' : 'regular');
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string>(generateType === 'regular' ? (generateId || '') : '');
  const [selectedBlankWorkLogId, setSelectedBlankWorkLogId] = useState<string>(generateType === 'blank' ? (generateId || '') : '');
  
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    includeContactInfo: true,
    includeCompanyInfo: true,
    includePersonnel: true,
    includeTasks: true,
    includeWatering: true,
    includeNotes: true,
    includeTimeTracking: true,
    includeSummary: true
  });
  
  // Auto-génération si les paramètres d'URL sont présents
  useEffect(() => {
    if (generateType && generateId) {
      if (generateType === 'blank' && selectedBlankWorkLogId === generateId) {
        handleGenerateWorkLogPDF(true);
      } else if (generateType === 'regular' && selectedWorkLogId === generateId) {
        handleGenerateWorkLogPDF(false);
      }
    }
  }, [selectedBlankWorkLogId, selectedWorkLogId, generateType, generateId]);
  
  const handleOptionChange = (option: keyof PDFOptions, value: boolean) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleGenerateWorkLogPDF = async (isBlank: boolean = false) => {
    const selectedId = isBlank ? selectedBlankWorkLogId : selectedWorkLogId;
    
    if (!selectedId) {
      toast.error(`Veuillez sélectionner une fiche ${isBlank ? 'vierge' : 'de suivi'}`);
      return;
    }
    
    const workLog = workLogs.find(log => log.id === selectedId);
    if (!workLog) {
      toast.error('Fiche non trouvée');
      return;
    }
    
    // Ne pas exiger du personnel pour les fiches vierges
    if (!isBlank && (!workLog.personnel || workLog.personnel.length === 0)) {
      toast.warning('Cette fiche n\'a pas de personnel assigné');
    }
    
    const project = pdfOptions.includeContactInfo ? getProjectById(workLog.projectId) : undefined;
    
    try {
      const pdfData = {
        workLog,
        project,
        companyInfo: pdfOptions.includeCompanyInfo ? settings.companyInfo : undefined,
        companyLogo: pdfOptions.includeCompanyInfo ? settings.companyLogo : undefined,
        pdfOptions: {
          ...pdfOptions,
          includeSummary: pdfOptions.includeSummary
        }
      };
      
      const fileName = await generatePDF(pdfData);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };

  return {
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
