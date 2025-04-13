
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FilePlus, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useProjects } from '@/context/ProjectsContext';
import PageHeader from './components/PageHeader';
import EmptyState from './components/EmptyState';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import AlertInfo from './components/AlertInfo';
import FormTab from './components/FormTab';

const BlankWorkSheetsPage = () => {
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
    // Reset editing ID if switching tabs
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
  };
  
  // Handle printing (same as export for now)
  const handlePrint = (id: string) => {
    handleExportPDF(id);
  };
  
  // Handle form success
  const handleFormSuccess = () => {
    setActiveTab('list');
    setEditingWorkLogId(null);
  };

  const handleCreateNew = () => {
    setEditingWorkLogId(null);
    setActiveTab('new');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        onCreateNew={handleCreateNew}
        onGoToWorkLogs={() => navigate('/worklogs')} 
        onGoToProjects={() => navigate('/projects')}
      />

      {blankWorkSheets.length > 0 && (
        <AlertInfo 
          sheetsCount={blankWorkSheets.length}
          hasActiveProjects={activeProjects.length > 0}
        />
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="list">Liste des fiches</TabsTrigger>
          <TabsTrigger value="new">
            {editingWorkLogId ? "Modifier la fiche" : "Nouvelle fiche"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="p-0 border-0 mt-6">
          {blankWorkSheets.length === 0 ? (
            <EmptyState onCreateNew={handleCreateNew} />
          ) : (
            <BlankWorkSheetList 
              sheets={blankWorkSheets}
              onCreateNew={handleCreateNew}
              onEdit={handleEditWorksheet}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
            />
          )}
        </TabsContent>
        
        <TabsContent value="new" className="p-0 border-0 mt-6">
          <FormTab
            editingWorkLogId={editingWorkLogId}
            getWorkLogById={getWorkLogById}
            onSuccess={handleFormSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlankWorkSheetsPage;
