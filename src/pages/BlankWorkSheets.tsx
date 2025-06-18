
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from '@/context/AppContext';
import { useBlankWorksheets } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import BlankWorkSheetHeader from '@/components/worksheets/page/BlankWorkSheetHeader';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import BlankWorkSheetTabContent from '@/components/worksheets/page/BlankWorkSheetTabContent';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import BlankSheetPDFOptionsDialog from '@/components/worksheets/BlankSheetPDFOptionsDialog';
import { generatePDF } from '@/utils/pdf';
import { BlankWorksheet } from '@/types/blankWorksheet';

const BlankWorkSheets: React.FC = () => {
  const navigate = useNavigate();
  const { projectInfos = [] } = useApp();
  const { blankWorksheets = [], getBlankWorksheetById } = useBlankWorksheets();
  const [activeTab, setActiveTab] = useState<string>("list");
  const [editingWorksheetId, setEditingWorksheetId] = useState<string | null>(null);
  const [pdfOptionsOpen, setPdfOptionsOpen] = useState<boolean>(false);
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const handleCreateNew = () => {
    setEditingWorksheetId(null);
    setActiveTab("new");
  };
  
  const handleEdit = (worksheetId: string) => {
    setEditingWorksheetId(worksheetId);
    setActiveTab("new");
  };

  const handleFormSuccess = () => {
    setEditingWorksheetId(null);
    setActiveTab("list");
  };
  
  // Function to handle PDF export
  const handleExportPDF = async (id: string) => {
    try {
      setSelectedWorksheetId(id);
      setPdfOptionsOpen(true);
    } catch (error) {
      console.error('Error preparing PDF export:', error);
    }
  };
  
  // Function to handle Print
  const handlePrint = async (id: string) => {
    try {
      const worksheet = getBlankWorksheetById(id);
      if (!worksheet) throw new Error('Worksheet not found');
      
      setIsExporting(true);
      
      // Convert BlankWorksheet to WorkLog format for PDF generation
      const workLogFormat = {
        ...worksheet,
        projectId: worksheet.linked_project_id || '',
        timeTracking: {
          totalHours: worksheet.total_hours
        },
        personnel: worksheet.personnel || [],
        hourlyRate: worksheet.hourly_rate,
        signedQuoteAmount: worksheet.signed_quote_amount || 0,
        isQuoteSigned: worksheet.is_quote_signed,
        invoiced: worksheet.invoiced,
        address: worksheet.address,
        createdAt: worksheet.created_at,
        clientName: worksheet.client_name,
        // Convert consumables to WorkLog format
        consumables: worksheet.consumables?.map(c => ({
          id: c.id,
          supplier: c.supplier,
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unit_price,
          totalPrice: c.total_price
        })) || []
      };
      
      await generatePDF({
        workLog: workLogFormat,
        action: 'print',
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
    if (!selectedWorksheetId) return;
    
    try {
      const worksheet = getBlankWorksheetById(selectedWorksheetId);
      if (!worksheet) throw new Error('Worksheet not found');
      
      setIsExporting(true);
      
      // Convert BlankWorksheet to WorkLog format for PDF generation
      const workLogFormat = {
        ...worksheet,
        projectId: worksheet.linked_project_id || '',
        timeTracking: {
          totalHours: worksheet.total_hours
        },
        personnel: worksheet.personnel || [],
        hourlyRate: worksheet.hourly_rate,
        signedQuoteAmount: worksheet.signed_quote_amount || 0,
        isQuoteSigned: worksheet.is_quote_signed,
        invoiced: worksheet.invoiced,
        address: worksheet.address,
        createdAt: worksheet.created_at,
        clientName: worksheet.client_name,
        // Convert consumables to WorkLog format
        consumables: worksheet.consumables?.map(c => ({
          id: c.id,
          supplier: c.supplier,
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unit_price,
          totalPrice: c.total_price
        })) || []
      };
      
      await generatePDF({
        workLog: workLogFormat,
        action: 'download',
        config: options
      });
      
      setPdfOptionsOpen(false);
      setIsExporting(false);
      setSelectedWorksheetId(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
    }
  };
  
  // Get the initial data for editing
  const initialData: BlankWorksheet | undefined = editingWorksheetId ? getBlankWorksheetById(editingWorksheetId) : undefined;
  
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
            editingWorkLogId={editingWorksheetId}
            onSuccess={handleFormSuccess}
            isBlankWorksheet={true}
            projectInfos={projectInfos}
            existingWorkLogs={blankWorksheets}
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
