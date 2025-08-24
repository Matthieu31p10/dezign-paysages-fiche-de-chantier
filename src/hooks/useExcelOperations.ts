import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { ProjectInfo } from '@/types/models';
import { toast } from 'sonner';

interface ExcelOperationsHook {
  isLoading: boolean;
  exportToExcel: (data: any[], filename: string, sheetName?: string) => Promise<void>;
  importFromExcel: (file: File) => Promise<any[]>;
  downloadTemplate: (templateData: any[], filename: string, sheetName?: string) => void;
}

export const useExcelOperations = (): ExcelOperationsHook => {
  const [isLoading, setIsLoading] = useState(false);

  const exportToExcel = useCallback(async (data: any[], filename: string, sheetName = 'Export') => {
    setIsLoading(true);
    try {
      // Créer un nouveau workbook Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Générer le fichier et le télécharger
      const finalFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
      XLSX.writeFile(wb, finalFilename);

      toast.success(`Export Excel réussi: ${finalFilename}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Erreur lors de l\'export Excel');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importFromExcel = useCallback(async (file: File): Promise<any[]> => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      return jsonData;
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Erreur lors de la lecture du fichier Excel');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadTemplate = useCallback((templateData: any[], filename: string, sheetName = 'Template') => {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      const finalFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
      XLSX.writeFile(wb, finalFilename);
      
      toast.success('Modèle Excel téléchargé');
    } catch (error) {
      console.error('Template download failed:', error);
      toast.error('Erreur lors du téléchargement du modèle');
    }
  }, []);

  return {
    isLoading,
    exportToExcel,
    importFromExcel,
    downloadTemplate
  };
};

export default useExcelOperations;