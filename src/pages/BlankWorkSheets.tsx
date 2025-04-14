
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useProjects } from '@/context/ProjectsContext';
import BlankWorkSheetHeader from '@/components/worksheets/page/BlankWorkSheetHeader';
import BlankWorkSheetAlert from '@/components/worksheets/page/BlankWorkSheetAlert';
import BlankWorkSheetList from '@/components/worksheets/list/BlankWorkSheetList';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import BlankWorkSheetTabContent from '@/components/worksheets/page/BlankWorkSheetTabContent';

const BlankWorkSheets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workLogs, getWorkLogById } = useWorkLogs();
  const { getActiveProjects } = useProjects();
  
  // Detect tab parameter in URL
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'list');
  
  // State to store the ID of the worksheet being edited
  const [editingWorkLogId, setEditingWorkLogId] = useState<string | null>(null);
  
  // Filter only blank worksheets
  const blankWorkSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  // Get active projects list
  const activeProjects = getActiveProjects();
  
  // Update URL when tab changes
  useEffect(() => {
    const newUrl = `${location.pathname}?tab=${activeTab}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset editing ID when changing tabs
    if (value !== 'new') {
      setEditingWorkLogId(null);
    }
  };
  
  // Handle editing a blank worksheet
  const handleEditWorksheet = (workLogId: string) => {
    setEditingWorkLogId(workLogId);
    setActiveTab('new');
  };
  
  // Handle exporting PDF
  const handleExportPDF = (id: string) => {
    // Redirect to reports page with PDF generation tab open
    navigate('/reports?tab=tools&generate=blank&id=' + id);
    toast.success("Redirection vers la génération de PDF...");
  };
  
  // Handle printing
  const handlePrint = (id: string) => {
    // Same as export for now
    handleExportPDF(id);
  };
  
  // Handle form success
  const handleFormSuccess = () => {
    toast.success(editingWorkLogId ? "Fiche modifiée avec succès" : "Fiche créée avec succès");
    setActiveTab('list');
    setEditingWorkLogId(null);
  };

  const handleCreateNew = () => {
    setEditingWorkLogId(null);
    setActiveTab('new');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <BlankWorkSheetHeader 
        onCreateNew={handleCreateNew} 
        navigate={navigate} 
      />
      
      {blankWorkSheets.length > 0 && (
        <BlankWorkSheetAlert 
          sheetsCount={blankWorkSheets.length} 
          hasActiveProjects={activeProjects.length > 0} 
        />
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="list" className="flex items-center">
            <BlankWorkSheetTabContent value="list" />
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center">
            <BlankWorkSheetTabContent 
              value="new" 
              isEditing={!!editingWorkLogId} 
            />
          </TabsTrigger>
        </TabsList>
        
        <BlankWorkSheetList 
          activeTab={activeTab}
          blankWorkSheets={blankWorkSheets}
          handleCreateNew={handleCreateNew}
          handleEditWorksheet={handleEditWorksheet}
          handleExportPDF={handleExportPDF}
          handlePrint={handlePrint}
        />
        
        <BlankWorkSheetForm 
          activeTab={activeTab}
          editingWorkLogId={editingWorkLogId}
          getWorkLogById={getWorkLogById}
          handleFormSuccess={handleFormSuccess}
        />
      </Tabs>
    </div>
  );
};

export default BlankWorkSheets;
