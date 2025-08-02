import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Search, Calendar, Filter } from 'lucide-react';

interface PassageFiltersProps {
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

export const PassageFilters: React.FC<PassageFiltersProps> = ({
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
  return (
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
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Tous les chantiers" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="">Tous les chantiers</SelectItem>
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
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Toutes les équipes" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="">Toutes les équipes</SelectItem>
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
  );
};