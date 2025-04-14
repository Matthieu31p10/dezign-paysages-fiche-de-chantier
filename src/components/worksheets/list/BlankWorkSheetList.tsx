
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { useProjects } from '@/context/ProjectsContext';
import BlankSheetItem from './blank-sheet-item';
import { Card, CardContent } from '@/components/ui/card';
import { useBlankSheetFilters } from './useBlankSheetFilters';
import BlankSheetFilters from './BlankSheetFilters';
import NoResults from './NoResults';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlankWorkSheetListProps {
  workLogs: WorkLog[];
  onEdit: (id: string) => void;
  onExportPDF: (id: string) => void;
  onPrint: (id: string) => void;
  onCreateNew: () => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ 
  workLogs,
  onEdit, 
  onExportPDF, 
  onPrint, 
  onCreateNew 
}) => {
  const { getProjectById } = useProjects();
  
  const {
    search,
    setSearch,
    selectedYear,
    setSelectedYear,
    sortOrder,
    invoiceFilter,
    setInvoiceFilter,
    availableYears,
    sortedSheets,
    hasActiveFilters,
    toggleSortOrder,
    clearFilters
  } = useBlankSheetFilters(workLogs, getProjectById);
  
  // Fonction pour obtenir le projet lié (si existe)
  const getLinkedProject = (sheet: WorkLog): ProjectInfo | null => {
    // Vérifier dans les notes si une référence à un projet existe
    const notes = sheet.notes || '';
    const projectIdMatch = notes.match(/PROJECT_ID:\s*([a-zA-Z0-9-_]+)/);
    
    if (projectIdMatch && projectIdMatch[1]) {
      try {
        return getProjectById(projectIdMatch[1]);
      } catch (error) {
        return null;
      }
    }
    
    return null;
  };
  
  return (
    <div className="space-y-4">
      <BlankSheetFilters 
        search={search}
        setSearch={setSearch}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortOrder={sortOrder}
        invoiceFilter={invoiceFilter}
        setInvoiceFilter={setInvoiceFilter}
        availableYears={availableYears}
        sheetsCount={sortedSheets.length}
        toggleSortOrder={toggleSortOrder}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />
      
      {sortedSheets.length === 0 ? (
        <NoResults 
          hasFilters={hasActiveFilters} 
          onClearFilters={clearFilters} 
          onCreateNew={onCreateNew}
        />
      ) : (
        <div className="space-y-4">
          {sortedSheets.map(sheet => (
            <BlankSheetItem 
              key={sheet.id}
              sheet={sheet}
              linkedProject={getLinkedProject(sheet)}
              onEdit={onEdit}
              onExportPDF={onExportPDF}
              onPrint={onPrint}
            />
          ))}
          
          <Card>
            <CardContent className="p-6 flex items-center justify-center">
              <Button onClick={onCreateNew} variant="outline" className="w-full max-w-md">
                <FilePlus className="w-4 h-4 mr-2" />
                Créer une nouvelle fiche vierge
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BlankWorkSheetList;
