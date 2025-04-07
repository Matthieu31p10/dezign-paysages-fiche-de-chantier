
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentYear } from '@/utils/helpers';
import { Button } from '@/components/ui/button';

interface BlankWorkSheetFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
}

const BlankWorkSheetFilters: React.FC<BlankWorkSheetFiltersProps> = ({
  search,
  setSearch,
  selectedYear,
  setSelectedYear,
  availableYears,
}) => {
  // Clear search function for better UX
  const handleClearSearch = () => {
    setSearch('');
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par client, projet associé, adresse, personnel, notes..."
          className="pl-8 pr-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClearSearch}
          >
            <span className="sr-only">Clear</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
            >
              <path
                d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z"
                fill="currentColor"
                opacity="0.1"
              />
              <path
                d="M2.47998 2.48l7.04004 7.04M2.47998 9.52l7.04004-7.04"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        )}
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
            {!availableYears.includes(getCurrentYear()) && (
              <SelectItem key={getCurrentYear()} value={getCurrentYear().toString()}>
                {getCurrentYear()}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BlankWorkSheetFilters;
