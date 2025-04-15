
import React, { useState } from 'react';
import { WorkLog } from '@/types/models';
import BlankSheetItem from './BlankSheetItem';
import BlankSheetFilters from './BlankSheetFilters';
import NoResults from './NoResults';
import EmptyBlankWorkSheetState from '../EmptyBlankWorkSheetState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BlankWorkSheetListProps {
  workLogs: WorkLog[];
  onCreateNew: () => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ workLogs, onCreateNew }) => {
  const [search, setSearch] = useState('');
  const [invoicedFilter, setInvoicedFilter] = useState<string>('all');
  
  // Filtre pour les fiches vierges seulement
  const blankSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  // Filtrage par terme de recherche et statut de facturation
  const filteredSheets = blankSheets.filter(sheet => {
    const matchesSearch = !search || 
      (sheet.clientName && sheet.clientName.toLowerCase().includes(search.toLowerCase())) ||
      (sheet.address && sheet.address.toLowerCase().includes(search.toLowerCase())) ||
      (sheet.notes && sheet.notes.toLowerCase().includes(search.toLowerCase()));
    
    const matchesInvoiced = 
      invoicedFilter === 'all' ||
      (invoicedFilter === 'invoiced' && sheet.invoiced) ||
      (invoicedFilter === 'not-invoiced' && !sheet.invoiced);
    
    return matchesSearch && matchesInvoiced;
  });
  
  // Tri par date (plus récent en premier)
  const sortedSheets = [...filteredSheets].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleInvoicedFilterChange = (value: string) => {
    setInvoicedFilter(value);
  };
  
  const handleClearFilters = () => {
    setSearch('');
    setInvoicedFilter('all');
  };
  
  if (blankSheets.length === 0) {
    return <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />;
  }
  
  const hasFilters = search !== '' || invoicedFilter !== 'all';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fiches vierges ({blankSheets.length})</h2>
        <Button onClick={onCreateNew} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Nouvelle fiche vierge
        </Button>
      </div>
      
      <BlankSheetFilters
        search={search}
        onSearchChange={handleSearchChange}
        invoicedFilter={invoicedFilter}
        onInvoicedFilterChange={handleInvoicedFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {sortedSheets.length === 0 ? (
        <NoResults 
          hasFilters={Boolean(hasFilters)}
          onClearFilters={handleClearFilters}
          onCreateNew={onCreateNew}
        />
      ) : (
        <div className="space-y-4">
          {sortedSheets.map((sheet) => (
            <BlankSheetItem key={sheet.id} worklog={sheet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlankWorkSheetList;
