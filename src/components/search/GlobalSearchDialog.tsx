import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, MapPin, User, FileText, Clock, Command } from 'lucide-react';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';
import { useKeyboardShortcuts, createCommonShortcuts } from '@/hooks/useKeyboardShortcuts';
import { formatDate } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: any[];
  workLogs: any[];
  teams: any[];
}

const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({
  isOpen,
  onClose,
  projects,
  workLogs,
  teams
}) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const {
    query,
    setQuery,
    selectedType,
    setSelectedType,
    searchResults,
    searchStats
  } = useGlobalSearch({ projects, workLogs, teams });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.id}`);
        break;
      case 'worklog':
        navigate(`/worklogs/${result.id}`);
        break;
      case 'blank-sheet':
        navigate(`/blank-sheets/${result.id}`);
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'worklog':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'blank-sheet':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Projet';
      case 'worklog':
        return 'Fiche de travail';
      case 'blank-sheet':
        return 'Fiche vierge';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche globale
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Input
              placeholder="Rechercher dans tous les projets, fiches de travail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-4 pr-4"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="outline" className="text-xs">
                <Command className="h-3 w-3 mr-1" />
                K
              </Badge>
            </div>
          </div>
        </div>

        {query && (
          <>
            <div className="px-6">
              <Tabs value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">
                    Tout ({searchStats.total})
                  </TabsTrigger>
                  <TabsTrigger value="project" className="text-xs">
                    Projets ({searchStats.projects})
                  </TabsTrigger>
                  <TabsTrigger value="worklog" className="text-xs">
                    Fiches ({searchStats.workLogs})
                  </TabsTrigger>
                  <TabsTrigger value="blank-sheet" className="text-xs">
                    Vierges ({searchStats.blankSheets})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="max-h-96 overflow-y-auto border-t">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.id}
                      className={`w-full rounded-md p-3 text-left transition-colors hover:bg-accent ${
                        index === selectedIndex ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{result.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(result.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {result.description}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score: {result.score}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun résultat trouvé pour "{query}"</p>
                  <p className="text-sm mt-1">
                    Essayez avec d'autres mots-clés ou filtres
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {!query && (
          <div className="p-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">Recherche globale</h3>
            <p className="text-sm">
              Tapez pour rechercher dans tous vos projets, fiches de travail et fiches vierges
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Command className="h-3 w-3" />K - Ouvrir la recherche
                </span>
                <span>↑↓ - Naviguer</span>
                <span>↵ - Sélectionner</span>
                <span>Esc - Fermer</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchDialog;