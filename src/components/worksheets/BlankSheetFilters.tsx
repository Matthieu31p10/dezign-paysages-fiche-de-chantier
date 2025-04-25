
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface BlankSheetFiltersProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invoicedFilter: 'all' | 'invoiced' | 'not-invoiced';
  onInvoicedFilterChange: (value: 'all' | 'invoiced' | 'not-invoiced') => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const BlankSheetFilters: React.FC<BlankSheetFiltersProps> = ({
  search,
  onSearchChange,
  invoicedFilter,
  onInvoicedFilterChange,
  hasFilters,
  onClearFilters
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Rechercher par client, numéro de fiche ou notes..."
            value={search}
            onChange={onSearchChange}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <Select
            value={invoicedFilter}
            onValueChange={onInvoicedFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut de facturation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les fiches</SelectItem>
              <SelectItem value="invoiced">Facturées</SelectItem>
              <SelectItem value="not-invoiced">Non facturées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {hasFilters && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlankSheetFilters;
