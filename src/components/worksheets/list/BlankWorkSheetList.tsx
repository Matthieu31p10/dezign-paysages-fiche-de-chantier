
import React, { useState, useMemo } from 'react';
import { WorkLog } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText } from 'lucide-react';
import BlankSheetItem from './blank-sheet-item';
import { useProjects } from '@/context/ProjectsContext';
import { isBlankWorksheet } from '../form/utils/generateUniqueIds';

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
  const [filterInvoiced, setFilterInvoiced] = useState<string>('all');
  const { getProjectById } = useProjects();
  
  // Safety check for data
  const validSheets = Array.isArray(sheets) ? sheets : [];
  
  // Filter to only include blank worksheets
  const blankSheets = useMemo(() => {
    return validSheets.filter(sheet => sheet.isBlankWorksheet === true);
  }, [validSheets]);
  
  // Fonction de filtrage améliorée
  const filteredSheets = useMemo(() => {
    return blankSheets.filter(sheet => {
      // Recherche multichamp (projet, notes, personnel, client)
      const searchLower = search.toLowerCase().trim();
      const matchesSearch = !searchLower ? true : (
        (sheet.projectId?.toLowerCase().includes(searchLower) || false) ||
        (sheet.notes?.toLowerCase().includes(searchLower) || false) ||
        (sheet.personnel?.some(person => person.toLowerCase().includes(searchLower)) || false) ||
        (sheet.clientName?.toLowerCase().includes(searchLower) || false)
      );
      
      // Filtre par statut de facturation
      const matchesInvoiced = filterInvoiced === 'all' || 
        (filterInvoiced === 'invoiced' && sheet.invoiced === true) ||
        (filterInvoiced === 'not-invoiced' && sheet.invoiced !== true);
      
      return matchesSearch && matchesInvoiced;
    });
  }, [blankSheets, search, filterInvoiced]);
  
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fiche par client, personnel, projet..."
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
                {search || filterInvoiced !== 'all' 
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
              linkedProject={sheet.linkedProjectId ? getProjectById(sheet.linkedProjectId) : null}
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
