
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from '@/context/AppContext';
import { WorkLog } from '@/types/models';
import BlankWorkSheetHeader from '@/components/worksheets/page/BlankWorkSheetHeader';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import BlankWorkSheetTabContent from '@/components/worksheets/page/BlankWorkSheetTabContent';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import BlankSheetPDFOptionsDialog from '@/components/worksheets/BlankSheetPDFOptionsDialog';
import { generatePDF } from '@/utils/pdf';
import { isBlankWorksheet } from '@/components/worksheets/form/utils/generateUniqueIds';

const BlankWorkSheets: React.FC = () => {
  const navigate = useNavigate();
  const { workLogs = [], projectInfos = [] } = useApp();
  const [activeTab, setActiveTab] = useState<string>("list");
  const [editingWorkLogId, setEditingWorkLogId] = useState<string | null>(null);
  const [pdfOptionsOpen, setPdfOptionsOpen] = useState<boolean>(false);
  const [selectedWorkLogId, setSelectedWorkLogId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  // Filter only blank worksheets using our consistent helper function
  const blankWorksheets = workLogs.filter(log => isBlankWorksheet(log.projectId));
  
  const handleCreateNew = () => {
    setEditingWorkLogId(null);
    setActiveTab("new");
  };
  
  const handleEdit = (workLogId: string) => {
    setEditingWorkLogId(workLogId);
    setActiveTab("new");
  };

  const handleFormSuccess = () => {
    setEditingWorkLogId(null);
    setActiveTab("list");
  };
  
  const getWorkLogById = (id: string) => {
    const workLog = workLogs.find(log => log.id === id);
    if (!workLog) {
      throw new Error(`WorkLog with ID ${id} not found`);
    }
    return workLog;
  };
  
  // Function to handle PDF export
  const handleExportPDF = async (id: string) => {
    try {
      setSelectedWorkLogId(id);
      setPdfOptionsOpen(true);
    } catch (error) {
      console.error('Error preparing PDF export:', error);
    }
  };
  
  // Function to handle Print
  const handlePrint = async (id: string) => {
    try {
      const workLog = getWorkLogById(id);
      
      setIsExporting(true);
      await generatePDF({
        workLog,
        action: 'print',  // This matches our updated PDFData interface
        config: {
          includeCompanyHeader: true,
          includeClientInfo: true,
          includeSignature: true
        }
      });
      setIsExporting(false);
    } catch (error) {
      console.error('Error printing worksheet:', error);
      setIsExporting(false);
    }
  };
  
  // Function to generate PDF with selected options
  const generateWorkSheetPDF = async (options: any) => {
    if (!selectedWorkLogId) return;
    
    try {
      const workLog = getWorkLogById(selectedWorkLogId);
      
      setIsExporting(true);
      await generatePDF({
        workLog,
        action: 'download',  // This matches our updated PDFData interface
        config: options
      });
      
      setPdfOptionsOpen(false);
      setIsExporting(false);
      setSelectedWorkLogId(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
    }
  };
  
  // Get the initial data for editing
  const initialData = editingWorkLogId ? getWorkLogById(editingWorkLogId) : undefined;
  
  return (
    <div className="animate-fade-in space-y-6">
      <BlankWorkSheetHeader onCreateNew={handleCreateNew} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="list">Liste des fiches</TabsTrigger>
          <TabsTrigger value="new">Nouvelle fiche</TabsTrigger>
        </TabsList>
        
        <BlankWorkSheetTabContent value="list">
          <BlankWorkSheetList 
            sheets={blankWorksheets}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />
        </BlankWorkSheetTabContent>
        
        <BlankWorkSheetTabContent value="new">
          <BlankWorkSheetForm
            initialData={initialData}
            editingWorkLogId={editingWorkLogId}
            onSuccess={handleFormSuccess}
            isBlankWorksheet={true}
            projectInfos={projectInfos}
            existingWorkLogs={workLogs}
          />
        </BlankWorkSheetTabContent>
      </Tabs>
      
      <AlertDialog open={pdfOptionsOpen} onOpenChange={setPdfOptionsOpen}>
        <AlertDialogTrigger className="hidden" />
        <BlankSheetPDFOptionsDialog
          onOpenChange={setPdfOptionsOpen}
          onExport={generateWorkSheetPDF}
          isLoading={isExporting}
        />
      </AlertDialog>
    </div>
  );
};

export default BlankWorkSheets;
