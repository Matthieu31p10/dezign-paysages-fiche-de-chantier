import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X, Save, RotateCcw, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useAdvancedFilters, FilterConfig, FilterPreset } from '@/hooks/useAdvancedFilters';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  data: any[];
  filterConfigs: FilterConfig[];
  onFilteredDataChange: (filteredData: any[]) => void;
  children?: React.ReactNode;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  data,
  filterConfigs,
  onFilteredDataChange,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savePresetName, setSavePresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

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
    data,
    filterConfigs,
    onFilterChange: onFilteredDataChange
  });

  const handleSavePreset = () => {
    if (savePresetName.trim()) {
      savePreset(savePresetName.trim());
      setSavePresetName('');
      setShowSavePreset(false);
    }
  };

  const renderFilterControl = (config: FilterConfig) => {
    const value = activeFilters[config.key];

    switch (config.type) {
      case 'text':
        return (
          <Input
            placeholder={config.placeholder || `Rechercher par ${config.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateFilter(config.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select 
            value={value || 'all'} 
            onValueChange={(newValue) => updateFilter(config.key, newValue === 'all' ? '' : newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Sélectionner ${config.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {(config.options || getUniqueValues(config.key).map(v => ({ value: v, label: v }))).map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiSelect':
        const selectedValues = Array.isArray(value) ? value : [];
        const availableOptions = config.options || getUniqueValues(config.key).map(v => ({ value: v, label: v }));
        
        return (
          <div className="space-y-2">
            <Select onValueChange={(newValue) => {
              const newArray = selectedValues.includes(newValue) 
                ? selectedValues.filter(v => v !== newValue)
                : [...selectedValues, newValue];
              updateFilter(config.key, newArray);
            }}>
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner ${config.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map(val => (
                  <Badge key={val} variant="secondary" className="text-xs">
                    {val}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() => updateFilter(config.key, selectedValues.filter(v => v !== val))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true}
              onCheckedChange={(checked) => updateFilter(config.key, checked ? true : undefined)}
            />
            <Label>{config.label}</Label>
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={config.placeholder || `Minimum ${config.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateFilter(config.key, e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        );

      case 'dateRange':
        const dateValue = value || { start: null, end: null };
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue.start ? formatDate(dateValue.start) : 'Date de début'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue.start ? new Date(dateValue.start) : undefined}
                    onSelect={(date) => 
                      updateFilter(config.key, { ...dateValue, start: date?.toISOString() })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue.end ? formatDate(dateValue.end) : 'Date de fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue.end ? new Date(dateValue.end) : undefined}
                    onSelect={(date) => 
                      updateFilter(config.key, { ...dateValue, end: date?.toISOString() })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtres avancés
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {filterSummary.activeCount}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres avancés
            </span>
            <div className="text-sm text-muted-foreground">
              {filterSummary.totalResults} / {filterSummary.totalData} résultats
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Préréglages</Label>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map(preset => (
                <div key={preset.id} className="flex items-center gap-1">
                  <Button
                    variant={currentPreset === preset.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadPreset(preset.id)}
                  >
                    {preset.name}
                  </Button>
                  {!preset.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavePreset(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              )}
            </div>

            {showSavePreset && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du préréglage"
                  value={savePresetName}
                  onChange={(e) => setSavePresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <Button onClick={handleSavePreset}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setShowSavePreset(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterConfigs.map(config => (
              <div key={config.key} className="space-y-2">
                <Label className="text-sm font-medium">{config.label}</Label>
                {renderFilterControl(config)}
              </div>
            ))}
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Filtres actifs</Label>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Effacer tout
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => {
                  const config = filterConfigs.find(c => c.key === key);
                  if (!config) return null;
                  
                  let displayValue = value;
                  if (config.type === 'dateRange') {
                    displayValue = `${value.start ? formatDate(value.start) : '∞'} - ${value.end ? formatDate(value.end) : '∞'}`;
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  }
                  
                  return (
                    <Badge key={key} variant="secondary">
                      {config.label}: {displayValue?.toString()}
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={() => updateFilter(key, undefined)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilters;