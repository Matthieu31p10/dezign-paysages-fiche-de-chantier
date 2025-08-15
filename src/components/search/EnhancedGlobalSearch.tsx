import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  Search, Command, Star, StarOff, Filter, Clock,
  Folder, Calendar, FileText, ArrowRight, TrendingUp,
  MapPin, User, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/helpers';

interface EnhancedGlobalSearchProps {
  projects: any[];
  workLogs: any[];
  teams: any[];
}

export const EnhancedGlobalSearch: React.FC<EnhancedGlobalSearchProps> = ({
  projects,
  workLogs,
  teams
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const {
    query,
    setQuery,
    selectedType,
    setSelectedType,
    searchResults,
    searchStats
  } = useGlobalSearch({ projects, workLogs, teams });

  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useFavorites();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    
    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.id}`);
        break;
      case 'worklog':
        navigate(`/worklogs/${result.id}`);
        break;
      case 'blank-sheet':
        navigate(`/worklogs/${result.id}`);
        break;
    }
    setIsOpen(false);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <Folder className="h-4 w-4 text-primary" />;
      case 'worklog':
        return <Calendar className="h-4 w-4 text-accent" />;
      case 'blank-sheet':
        return <FileText className="h-4 w-4 text-secondary" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return 'Projet';
      case 'worklog':
        return 'Fiche de suivi';
      case 'blank-sheet':
        return 'Fiche vierge';
      default:
        return 'Résultat';
    }
  };

  const handleFavoriteToggle = (result: SearchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const favoriteItem = {
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle
    };

    if (isFavorite(result.id)) {
      removeFromFavorites(result.id);
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const filterTypeOptions = [
    { value: 'all', label: 'Tout', count: searchStats.total },
    { value: 'project', label: 'Projets', count: searchStats.projects },
    { value: 'worklog', label: 'Fiches', count: searchStats.workLogs },
    { value: 'blank-sheet', label: 'Vierges', count: searchStats.blankSheets }
  ];

  return (
    <>
      {/* Search Trigger */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-sm justify-start text-muted-foreground hover:bg-accent/50"
      >
        <Search className="h-4 w-4 mr-3" />
        <span className="flex-1 text-left">Recherche globale...</span>
        <div className="flex items-center gap-1">
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </Button>

      {/* Enhanced Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
          {/* Header with Search Input */}
          <div className="flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center flex-1 px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                placeholder="Rechercher projets, fiches de suivi, équipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base bg-transparent"
                autoFocus
              />
            </div>
            
            <div className="flex items-center gap-2 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={cn(
                  "h-8 px-2",
                  showAdvancedFilters && "bg-accent"
                )}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 px-2"
              >
                <kbd className="text-xs">ESC</kbd>
              </Button>
            </div>
          </div>

          {/* Advanced Filters (collapsible) */}
          {showAdvancedFilters && (
            <div className="border-b bg-muted/30 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Période</label>
                  <select className="w-full mt-1 h-8 rounded border bg-background px-2 text-sm">
                    <option>Toutes</option>
                    <option>Cette semaine</option>
                    <option>Ce mois</option>
                    <option>Cette année</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Équipe</label>
                  <select className="w-full mt-1 h-8 rounded border bg-background px-2 text-sm">
                    <option>Toutes les équipes</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Statut</label>
                  <select className="w-full mt-1 h-8 rounded border bg-background px-2 text-sm">
                    <option>Tous les statuts</option>
                    <option>En cours</option>
                    <option>Terminé</option>
                    <option>En attente</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Trier par</label>
                  <select className="w-full mt-1 h-8 rounded border bg-background px-2 text-sm">
                    <option>Pertinence</option>
                    <option>Date (récent)</option>
                    <option>Date (ancien)</option>
                    <option>Nom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          {query && (
            <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/20">
              {filterTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedType === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedType(option.value as any)}
                  className="h-7 px-3 text-xs"
                >
                  {option.label}
                  {option.count > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-[10px]">
                      {option.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Main Content */}
          <ScrollArea className="max-h-[500px]">
            {!query ? (
              <div className="p-6">
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start h-auto p-3"
                      onClick={() => {
                        navigate('/projects/new');
                        setIsOpen(false);
                      }}
                    >
                      <Folder className="h-4 w-4 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Nouveau projet</div>
                        <div className="text-xs text-muted-foreground">Créer un chantier</div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start h-auto p-3"
                      onClick={() => {
                        navigate('/worklogs/new');
                        setIsOpen(false);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-3 text-accent" />
                      <div className="text-left">
                        <div className="font-medium">Nouvelle fiche</div>
                        <div className="text-xs text-muted-foreground">Ajouter un suivi</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Favoris
                    </h3>
                    <div className="space-y-1">
                      {favorites.slice(0, 3).map((fav) => (
                        <Button
                          key={fav.id}
                          variant="ghost"
                          className="w-full justify-start h-auto p-2"
                          onClick={() => {
                            navigate(`/${fav.type}s/${fav.id}`);
                            setIsOpen(false);
                          }}
                        >
                          {getResultIcon(fav.type as any)}
                          <div className="ml-3 text-left">
                            <div className="font-medium text-sm">{fav.title}</div>
                            <div className="text-xs text-muted-foreground">{fav.subtitle}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recherches récentes
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start h-auto p-2 text-left"
                          onClick={() => setQuery(search)}
                        >
                          <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help Section */}
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Conseils de recherche</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Utilisez <kbd className="px-1 py-0.5 bg-background rounded">⌘K</kbd> pour ouvrir la recherche</div>
                    <div>• Naviguez avec <kbd className="px-1 py-0.5 bg-background rounded">↑↓</kbd></div>
                    <div>• Sélectionnez avec <kbd className="px-1 py-0.5 bg-background rounded">⏎</kbd></div>
                    <div>• Ajoutez aux favoris avec <Star className="inline h-3 w-3" /></div>
                  </div>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="font-medium mb-2">Aucun résultat</h3>
                <p className="text-sm">
                  Aucun résultat trouvé pour "{query}"
                </p>
                <p className="text-xs mt-2">
                  Essayez avec des mots-clés différents ou utilisez les filtres avancés
                </p>
              </div>
            ) : (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                      "hover:bg-accent group",
                      index === selectedIndex && "bg-accent ring-2 ring-primary/20"
                    )}
                  >
                    <div className="shrink-0">
                      {getResultIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {result.title}
                        </h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {getResultTypeLabel(result.type)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {result.subtitle}
                      </p>
                      
                      <p className="text-xs text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleFavoriteToggle(result, e)}
                      >
                        {isFavorite(result.id) ? (
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{searchStats.total} résultat{searchStats.total > 1 ? 's' : ''}</span>
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => saveRecentSearch(query)}
                  >
                    Sauvegarder cette recherche
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 py-0.5 bg-background rounded">↑↓</kbd> naviguer</span>
                <span><kbd className="px-1 py-0.5 bg-background rounded">⏎</kbd> ouvrir</span>
                <span><kbd className="px-1 py-0.5 bg-background rounded">★</kbd> favoris</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedGlobalSearch;