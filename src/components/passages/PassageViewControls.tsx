import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List, Table, SortDesc } from 'lucide-react';

interface PassageViewControlsProps {
  viewMode: 'compact' | 'detailed' | 'table';
  setViewMode: (mode: 'compact' | 'detailed' | 'table') => void;
  sortBy: 'date' | 'project' | 'duration' | 'team' | 'daysSince';
  setSortBy: (sort: 'date' | 'project' | 'duration' | 'team' | 'daysSince') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  totalResults: number;
}

export const PassageViewControls: React.FC<PassageViewControlsProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  totalResults
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {totalResults} passage{totalResults !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Tri */}
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: 'date' | 'project' | 'duration' | 'team' | 'daysSince') => setSortBy(value)}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="project">Projet</SelectItem>
              <SelectItem value="duration">Durée</SelectItem>
              <SelectItem value="team">Équipe</SelectItem>
              <SelectItem value="daysSince">Jours écoulés</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-8 w-8 p-0"
          >
            <SortDesc className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Toggle vue */}
        <div className="flex border border-border rounded-md">
          <Button
            variant={viewMode === 'compact' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('compact')}
            className="h-8 px-3 rounded-r-none border-r border-border"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('detailed')}
            className="h-8 px-3 rounded-none border-r border-border"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8 px-3 rounded-l-none"
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};