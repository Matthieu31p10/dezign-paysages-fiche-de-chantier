
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkLogs } from '@/context/WorkLogsContext';
import { formatDate } from '@/utils/helpers';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, Search, Plus, Filter, Calendar, FileBarChart, Download, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { getCurrentYear, filterWorkLogsByYear, getYearsFromWorkLogs } from '@/utils/helpers';
import EmptyBlankWorkSheetState from './EmptyBlankWorkSheetState';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generatePDF, PDFData } from '@/utils/pdf';
import { toast } from 'sonner';
import BlankSheetPDFOptionsDialog from './BlankSheetPDFOptionsDialog';
import { WorkLog } from '@/types/models';

interface BlankWorkSheetListProps {
  onCreateNew: () => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  const { workLogs } = useWorkLogs();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedWorkLog, setSelectedWorkLog] = useState<WorkLog | null>(null);
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);

  // Identifie les fiches vierges (celles dont l'ID commence par "blank-")
  const blankWorkSheets = workLogs.filter(log => log.projectId.startsWith('blank-'));
  
  // Si aucune fiche vierge n'existe
  if (blankWorkSheets.length === 0) {
    return <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />;
  }

  // Années disponibles pour le filtre
  const availableYears = getYearsFromWorkLogs(blankWorkSheets);
  
  // Filtrer par année
  const yearFilteredSheets = selectedYear 
    ? filterWorkLogsByYear(blankWorkSheets, selectedYear) 
    : blankWorkSheets;

  // Filtrer par recherche
  const filteredSheets = yearFilteredSheets.filter(sheet => {
    if (!search.trim()) return true;
    
    const searchLower = search.toLowerCase();
    const clientName = sheet.notes ? extractClientName(sheet.notes) : '';
    const address = sheet.notes ? extractAddress(sheet.notes) : '';
    const notes = sheet.notes || '';
    
    return (
      clientName.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower) ||
      formatDate(sheet.date).includes(searchLower) ||
      notes.toLowerCase().includes(searchLower) ||
      sheet.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });

  // Trier par date
  const sortedSheets = [...filteredSheets].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

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
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };
  
  const clearFilters = () => {
    setSearch('');
    setSelectedYear(getCurrentYear());
    setSortOrder('newest');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, adresse, personnel, notes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Toutes les années</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredSheets.length} résultat{filteredSheets.length !== 1 ? 's' : ''}</span>
          {search || selectedYear !== getCurrentYear() || sortOrder !== 'newest' ? (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
              Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleSortOrder} className="text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {sortOrder === 'newest' ? 'Plus récentes' : 'Plus anciennes'}
          </Button>
          
          <Button onClick={onCreateNew} variant="default" size="sm" className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Nouvelle fiche
          </Button>
        </div>
      </div>

      {filteredSheets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Search className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Aucun résultat</h3>
              <p className="text-muted-foreground">
                Aucune fiche vierge ne correspond à votre recherche
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSheets.map(sheet => {
            const clientName = extractClientName(sheet.notes || '');
            const address = extractAddress(sheet.notes || '');
            const description = extractDescription(sheet.notes || '');
            
            return (
              <Card key={sheet.id} className="hover:border-primary/40 transition-all border-l-4 border-l-transparent hover:border-l-primary">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/worklogs/${sheet.id}`)}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileBarChart className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{clientName || "Client non spécifié"}</h3>
                        <Badge variant="outline" className="ml-auto md:ml-0">
                          {formatDate(sheet.date)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {address || "Adresse non spécifiée"}
                      </p>
                      
                      {description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 text-xs">
                        {sheet.personnel.slice(0, 3).map((person, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {person}
                          </Badge>
                        ))}
                        {sheet.personnel.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{sheet.personnel.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <div className="text-right mr-2">
                        <div className="text-sm font-medium">
                          {sheet.timeTracking?.totalHours.toFixed(1)} h
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Durée
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExportPDF(sheet.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Exporter en PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrint(sheet.id)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => navigate(`/worklogs/${sheet.id}`)}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BlankSheetPDFOptionsDialog
        open={isPDFDialogOpen}
        onOpenChange={setIsPDFDialogOpen}
        workLog={selectedWorkLog}
      />
    </div>
  );
};

// Helper functions to extract information from notes
const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/CLIENT\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/ADRESSE\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

const extractDescription = (notes: string): string => {
  const descMatch = notes.match(/DESCRIPTION DES TRAVAUX:([^]*?)(?=\n\n|\n$|$)/i);
  return descMatch ? descMatch[1].trim() : '';
};

export default BlankWorkSheetList;
