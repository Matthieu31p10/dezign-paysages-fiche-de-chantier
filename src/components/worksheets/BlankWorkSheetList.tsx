
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkLog } from '@/types/models';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import EmptyBlankWorkSheetState from './EmptyBlankWorkSheetState';
import BlankSheetPDFOptionsDialog from './BlankSheetPDFOptionsDialog';
import { extractLinkedProjectId } from '@/utils/helpers';
import BlankSheetFilters from './list/BlankSheetFilters';
import BlankSheetItem from './list/BlankSheetItem';
import NoResults from './list/NoResults';
import { useBlankSheetFilters } from './list/useBlankSheetFilters';

interface BlankWorkSheetListProps {
  onCreateNew: () => void;
  onEdit: (workLogId: string) => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ onCreateNew, onEdit }) => {
  const navigate = useNavigate();
  const { workLogs } = useWorkLogs();
  const { getProjectById } = useApp();
  const [selectedWorkLog, setSelectedWorkLog] = useState<WorkLog | null>(null);
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
  
  // Use custom hook for filtering
  const {
    blankWorkSheets,
    availableYears,
    search,
    setSearch,
    selectedYear,
    setSelectedYear,
    sortOrder,
    filteredSheets,
    sortedSheets,
    hasActiveFilters,
    toggleSortOrder,
    clearFilters
  } = useBlankSheetFilters(workLogs, getProjectById);
  
  // Show empty state if no worksheets exist
  if (blankWorkSheets.length === 0) {
    return <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />;
  }
  
  const handleExportPDF = (sheetId: string) => {
    const sheet = workLogs.find(log => log.id === sheetId);
    if (sheet) {
      setSelectedWorkLog(sheet);
      setIsPDFDialogOpen(true);
    } else {
      toast.error("Fiche non trouvée");
    }
  };

  const handlePrint = (sheetId: string) => {
    navigate(`/worklogs/${sheetId}?print=true`);
  };

  // Get linked project for a sheet
  const getLinkedProject = (sheet: WorkLog) => {
    const linkedProjectId = extractLinkedProjectId(sheet.notes || '');
    return linkedProjectId ? getProjectById(linkedProjectId) : null;
  };
  
  return (
    <div className="space-y-6">
      {/* Search and filter components */}
      <BlankSheetFilters
        search={search}
        setSearch={setSearch}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        onCreateNew={onCreateNew}
        filteredSheetsCount={filteredSheets.length}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredSheets.length === 0 ? (
        <NoResults onClearFilters={clearFilters} />
      ) : (
        <div className="space-y-4">
          {sortedSheets.map(sheet => (
            <BlankSheetItem
              key={sheet.id}
              sheet={sheet}
              linkedProject={getLinkedProject(sheet)}
              onEdit={onEdit}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
            />
          ))}
        </div>
      )}

      <BlankSheetPDFOptionsDialog
        open={isPDFDialogOpen} 
        onOpenChange={(open) => setIsPDFDialogOpen(!!open)}
        workLog={selectedWorkLog}
      />
    </div>
  );
};

export default BlankWorkSheetList;
