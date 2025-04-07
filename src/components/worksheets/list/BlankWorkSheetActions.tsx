
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface BlankWorkSheetActionsProps {
  resultCount: number;
  search: string;
  selectedYear: number;
  currentYear: number;
  sortOrder: 'newest' | 'oldest';
  onCreateNew: () => void;
  onToggleSortOrder: () => void;
  onClearFilters: () => void;
}

const BlankWorkSheetActions: React.FC<BlankWorkSheetActionsProps> = ({
  resultCount,
  search,
  selectedYear,
  currentYear,
  sortOrder,
  onCreateNew,
  onToggleSortOrder,
  onClearFilters,
}) => {
  const hasActiveFilters = search || selectedYear !== currentYear || sortOrder !== 'newest';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{resultCount} résultat{resultCount !== 1 ? 's' : ''}</span>
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 px-2 text-xs">
            Réinitialiser les filtres
          </Button>
        ) : null}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleSortOrder} className="text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {sortOrder === 'newest' ? 'Plus récentes' : 'Plus anciennes'}
        </Button>
        
        <Button onClick={onCreateNew} variant="default" size="sm" className="text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Nouvelle fiche
        </Button>
      </div>
    </div>
  );
};

export default BlankWorkSheetActions;
