import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Filter, Search, Save, Trash2, Settings, 
  Calendar, MapPin, User, Star, Clock,
  TrendingUp, Zap, BookmarkPlus
} from 'lucide-react';

interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  usageCount: number;
}

interface SmartFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  availableTeams: Array<{ id: string; name: string }>;
  availableProjects: Array<{ id: string; name: string }>;
  currentFilters: Record<string, any>;
}

export const SmartFilters: React.FC<SmartFiltersProps> = ({
  onFiltersChange,
  availableTeams,
  availableProjects,
  currentFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('filters');
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [localFilters, setLocalFilters] = useState(currentFilters);

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('filter-presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Error loading filter presets:', error);
      }
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem('filter-presets', JSON.stringify(presets));
  }, [presets]);

  // Sync local filters with current filters
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      description: presetDescription.trim(),
      filters: { ...localFilters },
      isPublic: false,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    setPresets(prev => [newPreset, ...prev]);
    setPresetName('');
    setPresetDescription('');
    setActiveTab('presets');
  };

  const loadPreset = (preset: FilterPreset) => {
    const updatedPreset = { ...preset, usageCount: preset.usageCount + 1 };
    setPresets(prev => prev.map(p => p.id === preset.id ? updatedPreset : p));
    
    setLocalFilters(preset.filters);
    onFiltersChange(preset.filters);
    setIsOpen(false);
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const clearAllFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter(key => {
      const value = localFilters[key];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  };

  const getMostUsedPresets = () => {
    return presets
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);
  };

  const getRecentPresets = () => {
    return presets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres intelligents
          </DialogTitle>
          <DialogDescription>
            Créez et sauvegardez des filtres personnalisés pour vos recherches
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Filtres
              </TabsTrigger>
              <TabsTrigger value="presets" className="flex items-center gap-2">
                <BookmarkPlus className="h-4 w-4" />
                Préréglages
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Rapides
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6">
            <TabsContent value="filters" className="space-y-6 pb-6">
              {/* Search Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Recherche textuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search-query">Recherche globale</Label>
                    <Input
                      id="search-query"
                      placeholder="Mots-clés dans tous les champs..."
                      value={localFilters.searchQuery || ''}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-search">Client</Label>
                      <Input
                        id="client-search"
                        placeholder="Nom du client..."
                        value={localFilters.clientName || ''}
                        onChange={(e) => handleFilterChange('clientName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address-search">Adresse</Label>
                      <Input
                        id="address-search"
                        placeholder="Adresse du chantier..."
                        value={localFilters.address || ''}
                        onChange={(e) => handleFilterChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Filtres temporels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-from">Du</Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={localFilters.dateFrom || ''}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to">Au</Label>
                      <Input
                        id="date-to"
                        type="date"
                        value={localFilters.dateTo || ''}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="period-preset">Périodes prédéfinies</Label>
                    <Select
                      value={localFilters.periodPreset || ''}
                      onValueChange={(value) => handleFilterChange('periodPreset', value)}
                    >
                      <SelectTrigger id="period-preset">
                        <SelectValue placeholder="Choisir une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Aujourd'hui</SelectItem>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="quarter">Ce trimestre</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                        <SelectItem value="last-week">Semaine dernière</SelectItem>
                        <SelectItem value="last-month">Mois dernier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Team and Project Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Équipes et projets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="team-filter">Équipe</Label>
                    <Select
                      value={localFilters.teamId || ''}
                      onValueChange={(value) => handleFilterChange('teamId', value)}
                    >
                      <SelectTrigger id="team-filter">
                        <SelectValue placeholder="Toutes les équipes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les équipes</SelectItem>
                        {availableTeams.map(team => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project-filter">Projet</Label>
                    <Select
                      value={localFilters.projectId || ''}
                      onValueChange={(value) => handleFilterChange('projectId', value)}
                    >
                      <SelectTrigger id="project-filter">
                        <SelectValue placeholder="Tous les projets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les projets</SelectItem>
                        {availableProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Status and Amount Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Statuts et montants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status-filter">Statut</Label>
                      <Select
                        value={localFilters.status || ''}
                        onValueChange={(value) => handleFilterChange('status', value)}
                      >
                        <SelectTrigger id="status-filter">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les statuts</SelectItem>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="invoice-status">Facturation</Label>
                      <Select
                        value={localFilters.invoiceStatus || ''}
                        onValueChange={(value) => handleFilterChange('invoiceStatus', value)}
                      >
                        <SelectTrigger id="invoice-status">
                          <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Toutes</SelectItem>
                          <SelectItem value="invoiced">Facturé</SelectItem>
                          <SelectItem value="not-invoiced">Non facturé</SelectItem>
                          <SelectItem value="quoted">Devisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount-min">Montant min (€)</Label>
                      <Input
                        id="amount-min"
                        type="number"
                        placeholder="0"
                        value={localFilters.amountMin || ''}
                        onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount-max">Montant max (€)</Label>
                      <Input
                        id="amount-max"
                        type="number"
                        placeholder="10000"
                        value={localFilters.amountMax || ''}
                        onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="with-notes"
                      checked={localFilters.withNotes || false}
                      onCheckedChange={(checked) => handleFilterChange('withNotes', checked)}
                    />
                    <Label htmlFor="with-notes">Uniquement avec des notes</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="presets" className="space-y-6 pb-6">
              {/* Save Current Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les filtres actuels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="preset-name">Nom du préréglage</Label>
                    <Input
                      id="preset-name"
                      placeholder="Ex: Projets en cours cette semaine"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preset-description">Description (optionnelle)</Label>
                    <Input
                      id="preset-description"
                      placeholder="Description du filtre..."
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={savePreset} 
                    disabled={!presetName.trim() || activeFiltersCount === 0}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder ({activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''})
                  </Button>
                </CardContent>
              </Card>

              {/* Saved Presets */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Préréglages sauvegardés</CardTitle>
                </CardHeader>
                <CardContent>
                  {presets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookmarkPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun préréglage sauvegardé</p>
                      <p className="text-sm">Configurez des filtres et sauvegardez-les</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {presets.map((preset) => (
                        <div key={preset.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{preset.name}</div>
                            {preset.description && (
                              <div className="text-sm text-muted-foreground">{preset.description}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {Object.keys(preset.filters).length} filtre{Object.keys(preset.filters).length > 1 ? 's' : ''} • 
                              Utilisé {preset.usageCount} fois • 
                              {new Date(preset.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadPreset(preset)}
                            >
                              Charger
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePreset(preset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick" className="space-y-6 pb-6">
              {/* Most Used Presets */}
              {getMostUsedPresets().length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Les plus utilisés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getMostUsedPresets().map((preset) => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => loadPreset(preset)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {preset.usageCount} utilisations
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recent Presets */}
              {getRecentPresets().length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Récemment créés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getRecentPresets().map((preset) => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => loadPreset(preset)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(preset.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Filtres rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('periodPreset', 'today')}
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('periodPreset', 'week')}
                  >
                    Cette semaine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('status', 'active')}
                  >
                    Projets actifs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('invoiceStatus', 'not-invoiced')}
                  >
                    Non facturé
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {activeFiltersCount > 0 && (
                <span>{activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                disabled={activeFiltersCount === 0}
              >
                Effacer tout
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Appliquer
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};