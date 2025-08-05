import { useState, useMemo, useCallback, useEffect } from 'react';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  isDefault?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiSelect' | 'dateRange' | 'boolean' | 'text' | 'number';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface UseAdvancedFiltersProps {
  data: any[];
  filterConfigs: FilterConfig[];
  onFilterChange?: (filteredData: any[]) => void;
}

export const useAdvancedFilters = ({ 
  data, 
  filterConfigs, 
  onFilterChange 
}: UseAdvancedFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([
    {
      id: 'default',
      name: 'Tous les éléments',
      filters: {},
      isDefault: true
    }
  ]);
  const [currentPreset, setCurrentPreset] = useState<string>('default');

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return data;

    return data.filter(item => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;

        const filterConfig = filterConfigs.find(config => config.key === key);
        if (!filterConfig) return true;

        const itemValue = item[key];

        switch (filterConfig.type) {
          case 'select':
            return itemValue === value;
          
          case 'multiSelect':
            if (!Array.isArray(value) || value.length === 0) return true;
            return value.includes(itemValue);
          
          case 'boolean':
            return itemValue === value;
          
          case 'text':
            if (!itemValue) return false;
            return itemValue.toLowerCase().includes(value.toLowerCase());
          
          case 'number':
            const numValue = parseFloat(value);
            const itemNumValue = parseFloat(itemValue);
            return !isNaN(numValue) && !isNaN(itemNumValue) && itemNumValue >= numValue;
          
          case 'dateRange':
            if (!value.start && !value.end) return true;
            const itemDate = new Date(itemValue);
            const startDate = value.start ? new Date(value.start) : null;
            const endDate = value.end ? new Date(value.end) : null;
            
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
          
          default:
            return true;
        }
      });
    });
  }, [data, activeFilters, filterConfigs]);

  // Update filters
  const updateFilter = useCallback((key: string, value: any) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      
      return newFilters;
    });
    setCurrentPreset('custom');
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setCurrentPreset('default');
  }, []);

  // Save current filters as preset
  const savePreset = useCallback((name: string) => {
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name,
      filters: { ...activeFilters }
    };
    
    setSavedPresets(prev => [...prev, newPreset]);
    setCurrentPreset(newPreset.id);
  }, [activeFilters]);

  // Load preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = savedPresets.find(p => p.id === presetId);
    if (preset) {
      setActiveFilters(preset.filters);
      setCurrentPreset(presetId);
    }
  }, [savedPresets]);

  // Delete preset
  const deletePreset = useCallback((presetId: string) => {
    if (presetId === 'default') return; // Can't delete default preset
    
    setSavedPresets(prev => prev.filter(p => p.id !== presetId));
    if (currentPreset === presetId) {
      setCurrentPreset('default');
      setActiveFilters({});
    }
  }, [currentPreset]);

  // Get unique values for a specific field (for dynamic filter options)
  const getUniqueValues = useCallback((key: string): string[] => {
    const values = data
      .map(item => item[key])
      .filter(value => value !== undefined && value !== null && value !== '');
    
    return Array.from(new Set(values)).sort();
  }, [data]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0;
  }, [activeFilters]);

  // Get filter summary
  const filterSummary = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const totalResults = filteredData.length;
    const totalData = data.length;
    
    return {
      activeCount,
      totalResults,
      totalData,
      isFiltered: activeCount > 0
    };
  }, [activeFilters, filteredData.length, data.length]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange?.(filteredData);
  }, [filteredData, onFilterChange]);

  return {
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
  };
};