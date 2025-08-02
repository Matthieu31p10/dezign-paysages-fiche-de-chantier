import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Users, Search, Calendar, Filter, Settings, X } from 'lucide-react';

interface MobilePassageFiltersProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  activeProjects: Array<{ id: string; name: string }>;
  activeTeams: Array<{ id: string; name: string }>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  totalPassages: number;
  filteredCount: number;
}

export const MobilePassageFilters: React.FC<MobilePassageFiltersProps> = ({
  selectedProject,
  setSelectedProject,
  selectedTeam,
  setSelectedTeam,
  activeProjects,
  activeTeams,
  searchQuery,
  setSearchQuery,
  periodFilter,
  setPeriodFilter,
  totalPassages,
  filteredCount
}) => {
  const hasActiveFilters = selectedProject !== '' || selectedTeam !== '' || searchQuery !== '' || periodFilter !== 'all';
  
  const clearAllFilters = () => {
    setSelectedProject('');
    setSelectedTeam('');
    setSearchQuery('');
    setPeriodFilter('all');
  };

  const activeFiltersCount = [
    searchQuery !== '',
    periodFilter !== 'all',
    selectedProject !== '',
    selectedTeam !== ''
  ].filter(Boolean).length;

  return (
    <>
      {/* Version mobile */}
      <div className="md:hidden">
        <Card className="bg-background border shadow-sm">
          <CardContent className="p-4">
            {/* Barre de recherche toujours visible */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>

              {/* Ligne avec compteur et boutons */}
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs">
                  {filteredCount} / {totalPassages}
                </Badge>

                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-8 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Effacer
                    </Button>
                  )}

                  {/* Bouton filtres avancés */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant={hasActiveFilters ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 px-2 relative"
                      >
                        <Filter className="h-3 w-3 mr-1" />
                        Filtres
                        {activeFiltersCount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto max-h-[80vh] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="flex items-center justify-between">
                          Filtres
                          {hasActiveFilters && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="text-xs"
                            >
                              Effacer tout
                            </Button>
                          )}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 pt-4">
                        {/* Filtre par période */}
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Période
                          </label>
                          <Select value={periodFilter} onValueChange={setPeriodFilter}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les périodes</SelectItem>
                              <SelectItem value="7">7 derniers jours</SelectItem>
                              <SelectItem value="30">30 derniers jours</SelectItem>
                              <SelectItem value="90">90 derniers jours</SelectItem>
                              <SelectItem value="180">6 derniers mois</SelectItem>
                              <SelectItem value="365">Dernière année</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Filtre par projet */}
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Chantier
                          </label>
                          <Select value={selectedProject || "all"} onValueChange={(value) => setSelectedProject(value === "all" ? "" : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les chantiers" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les chantiers</SelectItem>
                              {activeProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Filtre par équipe */}
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Équipe
                          </label>
                          <Select value={selectedTeam || "all"} onValueChange={(value) => setSelectedTeam(value === "all" ? "" : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Toutes les équipes" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les équipes</SelectItem>
                              {activeTeams.map((team) => (
                                <SelectItem key={team.id} value={team.name}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Badges des filtres actifs - Version mobile compacte */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1">
                  {periodFilter !== 'all' && (
                    <Badge variant="outline" className="text-xs h-6 px-2 flex items-center gap-1">
                      <Calendar className="h-2 w-2" />
                      {periodFilter === '7' && '7j'}
                      {periodFilter === '30' && '30j'}
                      {periodFilter === '90' && '90j'}
                      {periodFilter === '180' && '6m'}
                      {periodFilter === '365' && '1a'}
                      <button
                        onClick={() => setPeriodFilter('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedProject && (
                    <Badge variant="outline" className="text-xs h-6 px-2 flex items-center gap-1 max-w-32">
                      <MapPin className="h-2 w-2 flex-shrink-0" />
                      <span className="truncate">
                        {activeProjects.find(p => p.id === selectedProject)?.name}
                      </span>
                      <button
                        onClick={() => setSelectedProject('')}
                        className="ml-1 hover:text-destructive flex-shrink-0"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedTeam && (
                    <Badge variant="outline" className="text-xs h-6 px-2 flex items-center gap-1">
                      <Users className="h-2 w-2" />
                      <span className="truncate">{selectedTeam}</span>
                      <button
                        onClick={() => setSelectedTeam('')}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Version desktop (inchangée) */}
      <div className="hidden md:block">
        <Card className="bg-background border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et recherche
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {filteredCount} sur {totalPassages}
                </Badge>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Effacer tout
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barre de recherche */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
                <Search className="h-4 w-4" />
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de projet ou adresse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            {/* Filtre par période */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="7">7 derniers jours</SelectItem>
                  <SelectItem value="30">30 derniers jours</SelectItem>
                  <SelectItem value="90">90 derniers jours</SelectItem>
                  <SelectItem value="180">6 derniers mois</SelectItem>
                  <SelectItem value="365">Dernière année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtres existants en ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
                  <MapPin className="h-4 w-4" />
                  Chantier
                </label>
                <Select value={selectedProject || "all"} onValueChange={(value) => setSelectedProject(value === "all" ? "" : value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Tous les chantiers" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Tous les chantiers</SelectItem>
                    {activeProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
                  <Users className="h-4 w-4" />
                  Équipe
                </label>
                <Select value={selectedTeam || "all"} onValueChange={(value) => setSelectedTeam(value === "all" ? "" : value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Toutes les équipes" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    {activeTeams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Badges des filtres actifs */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Recherche: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {periodFilter !== 'all' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {periodFilter === '7' && '7 derniers jours'}
                    {periodFilter === '30' && '30 derniers jours'}
                    {periodFilter === '90' && '90 derniers jours'}
                    {periodFilter === '180' && '6 derniers mois'}
                    {periodFilter === '365' && 'Dernière année'}
                    <button
                      onClick={() => setPeriodFilter('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedProject && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Projet: {activeProjects.find(p => p.id === selectedProject)?.name}
                    <button
                      onClick={() => setSelectedProject('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedTeam && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Équipe: {selectedTeam}
                    <button
                      onClick={() => setSelectedTeam('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};