
import React, { useState } from 'react';
import { WorkLog } from '@/types/models';
import EmptyBlankWorkSheetState from './EmptyBlankWorkSheetState';
import BlankSheetItem from './list/blank-sheet-item';
import { groupWorkLogsByMonth } from '@/utils/date-helpers';
import { sortMonths } from '../worklogs/list/utils';
import BlankSheetFilters from './BlankSheetFilters';

export interface BlankWorkSheetListProps {
  sheets: WorkLog[];
  onCreateNew: () => void;
  onEdit: (workLogId: string) => void;
  onExportPDF: (id: string) => Promise<void>;
  onPrint: (id: string) => Promise<void>;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({
  sheets,
  onCreateNew,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const [search, setSearch] = useState('');
  const [invoicedFilter, setInvoicedFilter] = useState<'all' | 'invoiced' | 'not-invoiced'>('all');
  
  // Filter to only include blank worksheets
  const filteredSheets = sheets.filter(sheet => {
    // First check if it's marked as a blank worksheet
    const isBlank = sheet.isBlankWorksheet === true;
    if (!isBlank) return false;
    
    // Then apply search filter if needed
    const matchesSearch = !search || (
      (sheet.clientName?.toLowerCase().includes(search.toLowerCase())) ||
      (sheet.projectId?.toLowerCase().includes(search.toLowerCase())) ||
      (sheet.notes?.toLowerCase().includes(search.toLowerCase()))
    );
    
    // Then apply invoiced filter
    const matchesInvoiced = invoicedFilter === 'all' || 
      (invoicedFilter === 'invoiced' && sheet.invoiced) ||
      (invoicedFilter === 'not-invoiced' && !sheet.invoiced);
    
    return matchesSearch && matchesInvoiced;
  });
  
  // If there are no worksheets after filtering, show empty state
  if (!filteredSheets || filteredSheets.length === 0) {
    return search || invoicedFilter !== 'all' ? (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune fiche ne correspond à vos critères de recherche.</p>
      </div>
    ) : (
      <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />
    );
  }
  
  // Group worksheets by month
  const sheetsByMonth = groupWorkLogsByMonth(filteredSheets);
  
  // Sort months in reverse chronological order
  const sortedMonths = sortMonths(Object.keys(sheetsByMonth), 'date-desc');
  
  return (
    <div className="space-y-8 animate-fade-in">
      <BlankSheetFilters
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        invoicedFilter={invoicedFilter}
        onInvoicedFilterChange={setInvoicedFilter}
        hasFilters={search !== '' || invoicedFilter !== 'all'}
        onClearFilters={() => {
          setSearch('');
          setInvoicedFilter('all');
        }}
      />
      
      {sortedMonths.map(month => (
        <div key={month} className="space-y-4">
          <h2 className="text-xl font-semibold text-green-800 border-b border-green-100 pb-2">
            {month}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {sheetsByMonth[month].map(sheet => (
              <BlankSheetItem
                key={sheet.id}
                sheet={sheet}
                onEdit={() => onEdit(sheet.id)}
                onExportPDF={() => onExportPDF(sheet.id)}
                onPrint={() => onPrint(sheet.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlankWorkSheetList;
