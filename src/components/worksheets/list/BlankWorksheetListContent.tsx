
import React from 'react';
import { WorkLog } from '@/types/models';
import EmptyBlankWorkSheetState from '../EmptyBlankWorkSheetState';
import BlankWorkSheetFilters from './BlankWorkSheetFilters';
import BlankWorkSheetActions from './BlankWorkSheetActions';
import NoResultsState from './NoResultsState';
import BlankWorkSheetCard from './BlankWorkSheetCard';
import DeleteBlankWorkSheetDialog from './DeleteBlankWorkSheetDialog';
import BlankSheetPDFOptionsDialog from '../BlankSheetPDFOptionsDialog';

interface BlankWorksheetListContentProps {
  onCreateNew: () => void;
  onEdit?: (workLogId: string) => void;
  state: ReturnType<typeof import('./hooks/useBlankWorksheetList').useBlankWorksheetList>;
}

const BlankWorksheetListContent: React.FC<BlankWorksheetListContentProps> = ({ 
  onCreateNew, 
  onEdit, 
  state
}) => {
  const {
    search,
    setSearch,
    selectedYear,
    setSelectedYear,
    sortOrder,
    availableYears,
    blankWorkSheets,
    sortedSheets,
    filteredSheets,
    isPDFDialogOpen,
    setIsPDFDialogOpen,
    selectedWorkLog,
    workLogToDelete,
    setWorkLogToDelete,
    handleExportPDF,
    handlePrint,
    handleDeleteConfirm,
    toggleSortOrder,
    clearFilters,
    getCurrentYear,
    getProjectById,
    extractClientName,
    extractAddress,
    extractDescription,
    extractLinkedProjectId,
    extractHourlyRate,
    extractSignedQuote
  } = state;

  // If no blank worksheets exist
  if (blankWorkSheets.length === 0) {
    return <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />;
  }

  const handleEditWrapper = (workLogId: string) => {
    state.handleEdit(workLogId, onEdit);
  };

  return (
    <div className="space-y-6">
      <BlankWorkSheetFilters
        search={search}
        setSearch={setSearch}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
      />

      <BlankWorkSheetActions
        resultCount={filteredSheets.length}
        search={search}
        selectedYear={selectedYear}
        currentYear={getCurrentYear()}
        sortOrder={sortOrder}
        onCreateNew={onCreateNew}
        onToggleSortOrder={toggleSortOrder}
        onClearFilters={clearFilters}
      />

      {filteredSheets.length === 0 ? (
        <NoResultsState onClearFilters={clearFilters} />
      ) : (
        <div className="space-y-4">
          {sortedSheets.map(sheet => {
            const clientName = extractClientName(sheet.notes || '');
            const address = extractAddress(sheet.notes || '');
            const description = extractDescription(sheet.notes || '');
            
            // Check if the worksheet is linked to a project
            const linkedProjectId = extractLinkedProjectId(sheet.notes || '');
            const linkedProject = linkedProjectId ? getProjectById(linkedProjectId) : null;
            
            // Financial information
            const hourlyRate = extractHourlyRate(sheet.notes || '');
            const signedQuote = extractSignedQuote(sheet.notes || '');
            
            return (
              <BlankWorkSheetCard
                key={sheet.id}
                sheet={sheet}
                clientName={clientName}
                address={address}
                description={description}
                linkedProject={linkedProject ? { id: linkedProject.id, name: linkedProject.name } : null}
                hourlyRate={hourlyRate}
                signedQuote={signedQuote}
                onEdit={handleEditWrapper}
                onDelete={(id) => setWorkLogToDelete(id)}
                onExportPDF={handleExportPDF}
                onPrint={handlePrint}
              />
            );
          })}
        </div>
      )}

      <BlankSheetPDFOptionsDialog
        open={isPDFDialogOpen}
        onOpenChange={setIsPDFDialogOpen}
        workLog={selectedWorkLog}
      />

      <DeleteBlankWorkSheetDialog
        isOpen={!!workLogToDelete}
        onOpenChange={(open) => !open && setWorkLogToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BlankWorksheetListContent;
