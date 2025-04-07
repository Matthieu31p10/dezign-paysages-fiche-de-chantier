
import React from 'react';
import { Search, Calendar, Filter, Plus, Check, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentYear } from '@/utils/helpers';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlankSheetFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  sortOrder: 'newest' | 'oldest';
  toggleSortOrder: () => void;
  onCreateNew: () => void;
  filteredSheetsCount: number;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  invoiceFilter: 'all' | 'invoiced' | 'not-invoiced';
  setInvoiceFilter: (value: 'all' | 'invoiced' | 'not-invoiced') => void;
}

const BlankSheetFilters: React.FC<BlankSheetFiltersProps> = ({
  search,
  setSearch,
  selectedYear,
  setSelectedYear,
  availableYears,
  sortOrder,
  toggleSortOrder,
  onCreateNew,
  filteredSheetsCount,
  clearFilters,
  hasActiveFilters,
  invoiceFilter,
  setInvoiceFilter
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, projet associé, adresse, personnel, notes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
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

      <Tabs
        value={invoiceFilter}
        onValueChange={(value) => setInvoiceFilter(value as 'all' | 'invoiced' | 'not-invoiced')}
        className="mb-2"
      >
        <TabsList>
          <TabsTrigger value="all" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1" />
            Toutes les fiches
          </TabsTrigger>
          <TabsTrigger value="invoiced" className="text-xs">
            <Check className="h-3.5 w-3.5 mr-1" />
            Facturées
          </TabsTrigger>
          <TabsTrigger value="not-invoiced" className="text-xs">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Non facturées
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredSheetsCount} résultat{filteredSheetsCount !== 1 ? 's' : ''}</span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
              Réinitialiser les filtres
            </Button>
          )}
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
    </>
  );
};

export default BlankSheetFilters;
