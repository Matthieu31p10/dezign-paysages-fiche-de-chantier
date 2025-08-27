import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Search, Filter, X, Calendar as CalendarIcon, 
  SortAsc, SortDesc, MapPin, User, Tag,
  Clock, Star, Settings, RefreshCw, Download
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'daterange' | 'number';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: Date;
  location?: string;
  author?: string;
  rating?: number;
  status?: string;
}

interface AdvancedSearchProps {
  data?: SearchResult[];
  filters?: SearchFilter[];
  onSearch?: (query: string, filters: Record<string, any>) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const defaultFilters: SearchFilter[] = [
  {
    id: 'category',
    label: 'Catégorie',
    type: 'select',
    options: [
      { id: 'all', label: 'Toutes', value: 'all' },
      { id: 'projet', label: 'Projets', value: 'projet', count: 45 },
      { id: 'client', label: 'Clients', value: 'client', count: 23 },
      { id: 'personnel', label: 'Personnel', value: 'personnel', count: 12 },
      { id: 'document', label: 'Documents', value: 'document', count: 67 }
    ]
  },
  {
    id: 'status',
    label: 'Statut',
    type: 'multiselect',
    options: [
      { id: 'active', label: 'Actif', value: 'active', count: 89 },
      { id: 'pending', label: 'En attente', value: 'pending', count: 34 },
      { id: 'completed', label: 'Terminé', value: 'completed', count: 156 },
      { id: 'cancelled', label: 'Annulé', value: 'cancelled', count: 12 }
    ]
  },
  {
    id: 'dateRange',
    label: 'Période',
    type: 'daterange'
  },
  {
    id: 'rating',
    label: 'Note minimale',
    type: 'number',
    min: 1,
    max: 5
  }
];

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Maintenance Jardin Dubois',
    description: 'Entretien mensuel du jardin avec taille des haies et arrosage automatique',
    category: 'projet',
    tags: ['maintenance', 'jardin', 'mensuel'],
    date: new Date('2024-01-15'),
    location: 'Paris 16ème',
    author: 'Jean Martin',
    rating: 4.5,
    status: 'active'
  },
  {
    id: '2',
    title: 'Installation Système d\'Arrosage',
    description: 'Installation complète d\'un système d\'arrosage automatique pour villa',
    category: 'projet',
    tags: ['installation', 'arrosage', 'villa'],
    date: new Date('2024-01-20'),
    location: 'Neuilly-sur-Seine',
    author: 'Pierre Durand',
    rating: 5,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Équipe Maintenance Nord',
    description: 'Équipe spécialisée dans la maintenance des espaces verts du secteur nord',
    category: 'personnel',
    tags: ['équipe', 'maintenance', 'secteur-nord'],
    date: new Date('2024-01-10'),
    author: 'Marie Leclerc',
    rating: 4.2,
    status: 'active'
  }
];

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  data = mockResults,
  filters = defaultFilters,
  onSearch,
  onResultSelect,
  placeholder = "Rechercher...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'rating' | 'title'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredResults = useMemo(() => {
    let results = data;

    // Filtrage par texte
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(item => 
        searchTerms.every(term =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.tags.some(tag => tag.toLowerCase().includes(term)) ||
          item.category.toLowerCase().includes(term)
        )
      );
    }

    // Application des filtres
    Object.entries(activeFilters).forEach(([filterId, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const filter = filters.find(f => f.id === filterId);
      if (!filter) return;

      switch (filter.type) {
        case 'select':
          if (value !== 'all') {
            results = results.filter(item => item.category === value);
          }
          break;
        case 'multiselect':
          if (Array.isArray(value) && value.length > 0) {
            results = results.filter(item => 
              value.includes(item.status)
            );
          }
          break;
        case 'number':
          results = results.filter(item => 
            item.rating && item.rating >= value
          );
          break;
        case 'daterange':
          if (dateRange?.from && dateRange?.to) {
            results = results.filter(item => 
              item.date >= dateRange.from! && item.date <= dateRange.to!
            );
          }
          break;
      }
    });

    // Tri
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default: // relevance
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  }, [data, query, activeFilters, sortBy, sortOrder, dateRange, filters]);

  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  }, []);

  const clearFilters = () => {
    setActiveFilters({});
    setDateRange(undefined);
    setQuery('');
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => 
    v && (Array.isArray(v) ? v.length > 0 : v !== 'all')
  ).length + (dateRange ? 1 : 0);

  const renderFilter = (filter: SearchFilter) => {
    const value = activeFilters[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value || 'all'}
            onValueChange={(val) => handleFilterChange(filter.id, val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}-${option.id}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                />
                <Label htmlFor={`${filter.id}-${option.id}`} className="flex items-center gap-2">
                  {option.label}
                  {option.count && (
                    <Badge variant="outline" className="text-xs">
                      {option.count}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'daterange':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Sélectionner une période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              min={filter.min}
              max={filter.max}
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.id, Number(e.target.value))}
              placeholder={`Min: ${filter.min}, Max: ${filter.max}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {filter.min}</span>
              <span>Max: {filter.max}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResult = (result: SearchResult) => (
    <Card 
      key={result.id} 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onResultSelect?.(result)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{result.title}</h3>
          <div className="flex items-center gap-2">
            {result.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{result.rating}</span>
              </div>
            )}
            <Badge variant="secondary">{result.category}</Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {result.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {result.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{result.location}</span>
              </div>
            )}
            {result.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{result.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(result.date, 'dd/MM/yyyy')}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {result.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Pertinence</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="rating">Note</SelectItem>
            <SelectItem value="title">Titre</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtres de recherche</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <Label className="text-sm font-medium">{filter.label}</Label>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredResults.length} résultat{filteredResults.length !== 1 ? 's' : ''} trouvé{filteredResults.length !== 1 ? 's' : ''}
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <div className="space-y-3">
        {filteredResults.map(renderResult)}
      </div>

      {filteredResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou vos filtres
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Réinitialiser la recherche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};