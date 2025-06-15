import React, { useState, useMemo } from 'react';
import { BlankWorksheet } from '@/types/blankWorksheet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText } from 'lucide-react';
import BlankSheetItem from './list/blank-sheet-item';
import { useProjects } from '@/context/ProjectsContext';
import BlankSheetFilters from './BlankSheetFilters';
import { groupWorkLogsByMonth } from '@/utils/date-helpers';
import { sortMonths } from '../worklogs/list/utils';

interface BlankWorkSheetListProps {
  sheets?: BlankWorksheet[];
  onSelectSheet?: (id: string) => void;
  onCreateNew?: () => void;
  onEdit?: (id: string) => void;
  onExportPDF?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ 
  sheets = [], 
  onSelectSheet,
  onCreateNew,
  onEdit,
  onExportPDF = () => {},
  onPrint = () => {}
}) => {
  const [search, setSearch] = useState('');
  const [invoicedFilter, setInvoicedFilter] = useState<'all' | 'invoiced' | 'not-invoiced'>('all');
  const { getProjectById } = useProjects();
  
  // Safety check for data
  const validSheets = Array.isArray(sheets) ? sheets : [];
  
  // Fonction de filtrage améliorée
  const filteredSheets = useMemo(() => {
    return validSheets.filter(sheet => {
      // Recherche multichamp (notes, personnel, client)
      const searchLower = search.toLowerCase().trim();
      const matchesSearch = !searchLower ? true : (
        (sheet.notes?.toLowerCase().includes(searchLower) || false) ||
        (sheet.personnel?.some(person => person.toLowerCase().includes(searchLower)) || false) ||
        (sheet.client_name?.toLowerCase().includes(searchLower) || false)
      );
      
      // Filtre par statut de facturation
      const matchesInvoiced = invoicedFilter === 'all' || 
        (invoicedFilter === 'invoiced' && sheet.invoiced === true) ||
        (invoicedFilter === 'not-invoiced' && sheet.invoiced !== true);
      
      return matchesSearch && matchesInvoiced;
    });
  }, [validSheets, search, invoicedFilter]);
  
  const handleSelectSheet = (id: string) => {
    if (onSelectSheet) onSelectSheet(id);
  };

  const handleEdit = (id: string) => {
    if (onEdit) onEdit(id);
  };
  
  const handleExportPDF = (id: string) => {
    if (onExportPDF) onExportPDF(id);
  };
  
  const handlePrint = (id: string) => {
    if (onPrint) onPrint(id);
  };
  
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
      {filteredSheets.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune fiche trouvée</h3>
              <p className="text-muted-foreground">
                {search || invoicedFilter !== 'all' 
                  ? "Aucune fiche ne correspond à vos critères de recherche." 
                  : "Vous n'avez pas encore créé de fiches vierges."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSheets.map((sheet) => (
            <BlankSheetItem
              key={sheet.id}
              sheet={sheet}
              onEdit={onEdit ? () => onEdit(sheet.id) : undefined}
              onExportPDF={onExportPDF ? () => onExportPDF(sheet.id) : undefined}
              onPrint={onPrint ? () => onPrint(sheet.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlankWorkSheetList;
