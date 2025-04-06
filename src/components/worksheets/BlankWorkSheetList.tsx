
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkLogs } from '@/context/WorkLogsContext';
import { formatDate } from '@/utils/helpers';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, Search, Plus, Filter, Calendar, FileBarChart } from 'lucide-react';
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

const BlankWorkSheetList = () => {
  const navigate = useNavigate();
  const { workLogs } = useWorkLogs();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  // Identifie les fiches vierges (celles dont l'ID commence par "blank-")
  const blankWorkSheets = workLogs.filter(log => log.projectId.startsWith('blank-'));
  
  // Si aucune fiche vierge n'existe
  if (blankWorkSheets.length === 0) {
    return <EmptyBlankWorkSheetState />;
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
    
    return (
      clientName.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower) ||
      formatDate(sheet.date).includes(searchLower) ||
      sheet.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });

  // Trier par date (plus récentes d'abord)
  const sortedSheets = [...filteredSheets].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, adresse, personnel..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="w-[180px]">
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
          
          <Button onClick={() => navigate('/blank-worksheets?tab=new')} variant="default">
            <Plus className="h-4 w-4 mr-2" />
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
                onClick={() => {
                  setSearch('');
                  setSelectedYear(getCurrentYear());
                }}
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
            
            return (
              <Card key={sheet.id} className="hover:border-primary transition-all cursor-pointer" 
                onClick={() => navigate(`/worklogs/${sheet.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileBarChart className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{clientName || "Client non spécifié"}</h3>
                        <Badge variant="outline" className="ml-auto md:ml-0">
                          {formatDate(sheet.date)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {address || "Adresse non spécifiée"}
                      </p>
                      
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
                    
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {sheet.timeTracking?.totalHours} h
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Durée
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper functions to extract client name and address from notes
const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/CLIENT\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/ADRESSE\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export default BlankWorkSheetList;
