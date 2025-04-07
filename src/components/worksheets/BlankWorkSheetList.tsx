
import React, { useState } from 'react';
import { WorkLog } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText } from 'lucide-react';
import BlankSheetItem from './list/BlankSheetItem';
import { useProjects } from '@/context/ProjectsContext';
import { ProjectInfo } from '@/types/models';

interface BlankWorkSheetListProps {
  sheets?: WorkLog[];
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
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterInvoiced, setFilterInvoiced] = useState<string>('all');
  const { getProjectById } = useProjects();
  
  // Safety check for data
  const validSheets = Array.isArray(sheets) ? sheets : [];
  
  const getFilteredSheets = () => {
    return validSheets.filter(sheet => {
      // Filter by search term
      const matchesSearch = !search ? true : (
        (sheet.projectId?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (sheet.notes?.toLowerCase().includes(search.toLowerCase()) || false) ||
        sheet.personnel.some(person => person.toLowerCase().includes(search.toLowerCase()))
      );
      
      // Filter by invoiced status
      const matchesInvoiced = filterInvoiced === 'all' || 
        (filterInvoiced === 'invoiced' && sheet.invoiced) ||
        (filterInvoiced === 'not-invoiced' && !sheet.invoiced);
      
      return matchesSearch && matchesInvoiced;
    });
  };
  
  const filteredSheets = getFilteredSheets();
  
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fiche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select
          value={filterInvoiced}
          onValueChange={setFilterInvoiced}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Facturation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="invoiced">Facturé</SelectItem>
            <SelectItem value="not-invoiced">Non facturé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredSheets.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune fiche trouvée</h3>
              <p className="text-muted-foreground">
                Aucune fiche ne correspond à vos critères de recherche.
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
              linkedProject={sheet.notes ? getProjectById(sheet.notes) : null}
              onEdit={handleEdit}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlankWorkSheetList;
