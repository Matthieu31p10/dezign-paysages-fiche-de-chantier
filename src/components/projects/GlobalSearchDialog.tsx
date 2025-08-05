import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';
import { ProjectInfo, WorkLog } from '@/types/models';
import { Search, FileText, Folder, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GlobalSearchDialogProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: { id: string; name: string }[];
  onSelectProject?: (projectId: string) => void;
  onSelectWorkLog?: (workLogId: string) => void;
}

export const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({
  projects,
  workLogs,
  teams,
  onSelectProject,
  onSelectWorkLog
}) => {
  const navigate = useNavigate();
  
  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    openSearch,
    closeSearch,
    selectedType,
    setSelectedType,
    searchResults,
    searchStats,
    hasResults
  } = useGlobalSearch({ projects, workLogs, teams });

  // Raccourci clavier pour ouvrir la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <Folder className="h-4 w-4 text-blue-500" />;
      case 'worklog':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'blank-sheet':
        return <FileText className="h-4 w-4 text-orange-500" />;
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

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        onSelectProject?.(result.id);
        navigate(`/projects/${result.id}`);
        break;
      case 'worklog':
        onSelectWorkLog?.(result.id);
        navigate(`/worklogs/${result.id}`);
        break;
      case 'blank-sheet':
        navigate(`/worklogs/${result.id}`);
        break;
    }
    closeSearch();
  };

  const filterTypeOptions = [
    { value: 'all', label: 'Tout', count: searchStats.total },
    { value: 'project', label: 'Projets', count: searchStats.projects },
    { value: 'worklog', label: 'Fiches de suivi', count: searchStats.workLogs },
    { value: 'blank-sheet', label: 'Fiches vierges', count: searchStats.blankSheets }
  ];

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outline"
        onClick={openSearch}
        className="relative w-64 justify-start text-muted-foreground"
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground mr-3" />
            <Input
              placeholder="Rechercher dans les projets, fiches de suivi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              autoFocus
            />
          </div>

          {/* Filter Tabs */}
          {query && (
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
              {filterTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedType === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedType(option.value as any)}
                  className="h-7 px-3"
                >
                  {option.label}
                  {option.count > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                      {option.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Results */}
          <ScrollArea className="max-h-96">
            {!query ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="font-medium mb-2">Recherche globale</h3>
                <p className="text-sm">
                  Recherchez dans vos projets, fiches de suivi et données.
                </p>
                <p className="text-xs mt-2 opacity-70">
                  Utilisez <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘K</kbd> pour ouvrir la recherche
                </p>
              </div>
            ) : !hasResults ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-4 opacity-20" />
                <h3 className="font-medium mb-2">Aucun résultat</h3>
                <p className="text-sm">
                  Aucun résultat trouvé pour "{query}"
                </p>
              </div>
            ) : (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-muted/50 group"
                    )}
                  >
                    <div className="mt-0.5">
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

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer with shortcuts */}
          {hasResults && (
            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
              <div>
                {searchStats.total} résultat{searchStats.total > 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1 py-0.5 bg-background rounded">↑↓</kbd> naviguer
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-background rounded">⏎</kbd> sélectionner
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-background rounded">esc</kbd> fermer
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearchDialog;