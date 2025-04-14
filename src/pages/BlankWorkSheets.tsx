
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useProjects } from '@/context/ProjectsContext';
import BlankWorkSheetHeader from '@/components/worksheets/page/BlankWorkSheetHeader';
import BlankWorkSheetAlert from '@/components/worksheets/page/BlankWorkSheetAlert';
import BlankWorkSheetList from '@/components/worksheets/list/BlankWorkSheetList';
import BlankWorkSheetForm from '@/components/worksheets/form/BlankWorkSheetForm';
import BlankWorkSheetTabContent from '@/components/worksheets/page/BlankWorkSheetTabContent';
import OriginalBlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';

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
  
  // Dialog state for new worksheet creation
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  
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
    setIsNewDialogOpen(false);
  };

  const handleCreateNew = () => {
    setIsNewDialogOpen(true);
    setEditingWorkLogId(null);
  };

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
        
        <TabsContent value="list" className="p-0 border-0 mt-6">
          <BlankWorkSheetList 
            workLogs={blankWorkSheets}
            onEdit={handleEditWorksheet}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
        
        {activeTab === 'new' && (
          <BlankWorkSheetForm 
            editingWorkLogId={editingWorkLogId}
            getWorkLogById={getWorkLogById}
            handleFormSuccess={handleFormSuccess}
          />
        )}
      </Tabs>
      
      {/* Dialog pour créer une nouvelle fiche */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="py-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              Nouvelle fiche vierge
            </h2>
            <OriginalBlankWorkSheetForm 
              onSuccess={handleFormSuccess}
              projectInfos={activeProjects}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlankWorkSheets;
