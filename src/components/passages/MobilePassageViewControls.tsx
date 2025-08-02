import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Grid3X3, List, Table, SortDesc, Settings, ChevronDown } from 'lucide-react';

interface MobilePassageViewControlsProps {
  viewMode: 'compact' | 'detailed' | 'table';
  setViewMode: (mode: 'compact' | 'detailed' | 'table') => void;
  sortBy: 'date' | 'project' | 'duration' | 'team' | 'daysSince';
  setSortBy: (sort: 'date' | 'project' | 'duration' | 'team' | 'daysSince') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  totalResults: number;
}

export const MobilePassageViewControls: React.FC<MobilePassageViewControlsProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  totalResults
}) => {
  const getSortLabel = () => {
    const labels = {
      date: 'Date',
      project: 'Projet',
      duration: 'Durée',
      team: 'Équipe',
      daysSince: 'Jours écoulés'
    };
    return labels[sortBy];
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'compact': return <Grid3X3 className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      default: return <List className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Version mobile (hidden on desktop) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground font-medium">
            {totalResults} passage{totalResults !== 1 ? 's' : ''}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Mode d'affichage rapide */}
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="h-8 w-8 p-0 rounded-r-none border-r border-border"
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className="h-8 w-8 p-0 rounded-l-none"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>

            {/* Tri rapide */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-8 w-8 p-0"
            >
              <SortDesc className={`h-3 w-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </Button>

            {/* Menu des options avancées */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <Settings className="h-3 w-3 mr-1" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Options d'affichage</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 pt-4">
                  {/* Sélection du tri */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Trier par</label>
                    <Select value={sortBy} onValueChange={(value: 'date' | 'project' | 'duration' | 'team' | 'daysSince') => setSortBy(value)}>
                      <SelectTrigger>
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
                  </div>

                  {/* Mode d'affichage complet */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mode d'affichage</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={viewMode === 'compact' ? 'default' : 'outline'}
                        onClick={() => setViewMode('compact')}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <Grid3X3 className="h-4 w-4" />
                        <span className="text-xs">Compact</span>
                      </Button>
                      <Button
                        variant={viewMode === 'detailed' ? 'default' : 'outline'}
                        onClick={() => setViewMode('detailed')}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <List className="h-4 w-4" />
                        <span className="text-xs">Détaillé</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                        onClick={() => setViewMode('table')}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <Table className="h-4 w-4" />
                        <span className="text-xs">Tableau</span>
                      </Button>
                    </div>
                  </div>

                  {/* Ordre de tri */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ordre</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={sortOrder === 'desc' ? 'default' : 'outline'}
                        onClick={() => setSortOrder('desc')}
                        className="flex items-center gap-2"
                      >
                        <SortDesc className="h-4 w-4" />
                        Décroissant
                      </Button>
                      <Button
                        variant={sortOrder === 'asc' ? 'default' : 'outline'}
                        onClick={() => setSortOrder('asc')}
                        className="flex items-center gap-2"
                      >
                        <SortDesc className="h-4 w-4 rotate-180" />
                        Croissant
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Version desktop (inchangée) */}
      <div className="hidden md:flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border">
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
    </>
  );
};