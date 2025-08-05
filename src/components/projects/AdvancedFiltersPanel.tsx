import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FilterConfig, FilterPreset, useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { ProjectInfo } from '@/types/models';
import { Filter, X, Save, Download, Upload } from 'lucide-react';

interface AdvancedFiltersPanelProps {
  projects: ProjectInfo[];
  onFilteredDataChange: (filteredProjects: ProjectInfo[]) => void;
  teams: { id: string; name: string }[];
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  projects,
  onFilteredDataChange,
  teams
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Configuration des filtres avancés
  const filterConfigs: FilterConfig[] = [
    {
      key: 'name',
      label: 'Nom du projet',
      type: 'text',
      placeholder: 'Rechercher par nom...'
    },
    {
      key: 'clientName',
      label: 'Nom du client',
      type: 'text',
      placeholder: 'Rechercher par client...'
    },
    {
      key: 'address',
      label: 'Adresse',
      type: 'text',
      placeholder: 'Rechercher par adresse...'
    },
    {
      key: 'projectType',
      label: 'Type de projet',
      type: 'select',
      options: [
        { value: 'residence', label: 'Résidence' },
        { value: 'particular', label: 'Particulier' },
        { value: 'company', label: 'Entreprise' }
      ]
    },
    {
      key: 'team',
      label: 'Équipe',
      type: 'select',
      options: teams.map(team => ({ value: team.id, label: team.name }))
    },
    {
      key: 'irrigationType',
      label: 'Type d\'irrigation',
      type: 'select',
      options: [
        { value: 'none', label: 'Aucune' },
        { value: 'manual', label: 'Manuelle' },
        { value: 'automatic', label: 'Automatique' }
      ]
    },
    {
      key: 'mowerType',
      label: 'Type de tondeuse',
      type: 'select',
      options: [
        { value: 'manual', label: 'Manuelle' },
        { value: 'robotic', label: 'Robotique' },
        { value: 'both', label: 'Les deux' }
      ]
    },
    {
      key: 'annualVisits',
      label: 'Visites annuelles minimum',
      type: 'number',
      placeholder: 'Ex: 12'
    },
    {
      key: 'annualTotalHours',
      label: 'Heures annuelles minimum',
      type: 'number',
      placeholder: 'Ex: 100'
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      type: 'dateRange'
    }
  ];

  const {
    activeFilters,
    filteredData,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    filterSummary,
    savedPresets,
    currentPreset,
    savePreset,
    loadPreset,
    deletePreset,
    getUniqueValues
  } = useAdvancedFilters({
    data: projects,
    filterConfigs,
    onFilterChange: onFilteredDataChange
  });

  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName);
      setPresetName('');
    }
  };

  const renderFilterInput = (config: FilterConfig) => {
    const value = activeFilters[config.key];

    switch (config.type) {
      case 'text':
        return (
          <Input
            placeholder={config.placeholder}
            value={value || ''}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={config.placeholder}
            value={value || ''}
            onChange={(e) => updateFilter(config.key, e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => updateFilter(config.key, newValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Choisir ${config.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'dateRange':
        return (
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Date de début"
              value={value?.start || ''}
              onChange={(e) => updateFilter(config.key, { ...value, start: e.target.value })}
              className="flex-1"
            />
            <Input
              type="date"
              placeholder="Date de fin"
              value={value?.end || ''}
              onChange={(e) => updateFilter(config.key, { ...value, end: e.target.value })}
              className="flex-1"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {filterSummary.activeCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filterSummary.totalResults} résultat{filterSummary.totalResults > 1 ? 's' : ''}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filters">Filtres</TabsTrigger>
            <TabsTrigger value="presets">Préréglages</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-6">
            {/* Résumé des filtres actifs */}
            {hasActiveFilters && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Filtres actifs :</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Effacer tout
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                      const config = filterConfigs.find(c => c.key === key);
                      if (!config || !value) return null;
                      
                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => updateFilter(key, undefined)}
                        >
                          {config.label}: {typeof value === 'object' ? 'Période sélectionnée' : value}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grille des filtres */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterConfigs.map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key} className="text-sm font-medium">
                    {config.label}
                  </Label>
                  {renderFilterInput(config)}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filterSummary.totalResults} projet{filterSummary.totalResults > 1 ? 's' : ''} 
                {filterSummary.isFiltered ? ` sur ${filterSummary.totalData}` : ''}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            {/* Sauvegarder le filtre actuel */}
            {hasActiveFilters && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sauvegarder comme préréglage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nom du préréglage..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSavePreset}
                      disabled={!presetName.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des préréglages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Préréglages sauvegardés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{preset.name}</span>
                          {preset.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Défaut
                            </Badge>
                          )}
                          {currentPreset === preset.id && (
                            <Badge variant="secondary" className="text-xs">
                              Actif
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Object.keys(preset.filters).length} filtre{Object.keys(preset.filters).length > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPreset(preset.id)}
                          disabled={currentPreset === preset.id}
                        >
                          Charger
                        </Button>
                        {!preset.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePreset(preset.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFiltersPanel;