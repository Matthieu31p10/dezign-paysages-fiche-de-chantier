import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Euro, 
  FileText, 
  Users, 
  MapPin,
  Settings,
  Star,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

export interface AdvancedFilters {
  searchQuery: string;
  dateRange: DateRange | undefined;
  invoiceStatus: 'all' | 'invoiced' | 'pending';
  quoteStatus: 'all' | 'signed' | 'unsigned';
  minHours: number | null;
  maxHours: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  hasNotes: 'all' | 'yes' | 'no';
  selectedTeams: string[];
  selectedProjects: string[];
}

interface WorkLogAdvancedFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  teams: Array<{ id: string; name: string; color: string }>;
  projects: Array<{ id: string; name: string }>;
  savedFilters: Array<{ id: string; name: string; filters: AdvancedFilters }>;
  onSaveFilter: (name: string, filters: AdvancedFilters) => void;
  onLoadFilter: (filters: AdvancedFilters) => void;
  onDeleteFilter: (id: string) => void;
}

export const WorkLogAdvancedFilters: React.FC<WorkLogAdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  teams,
  projects,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      dateRange: undefined,
      invoiceStatus: 'all',
      quoteStatus: 'all',
      minHours: null,
      maxHours: null,
      minAmount: null,
      maxAmount: null,
      hasNotes: 'all',
      selectedTeams: [],
      selectedProjects: []
    });
  };

  const hasActiveFilters = () => {
    return filters.searchQuery !== '' ||
           filters.dateRange !== undefined ||
           filters.invoiceStatus !== 'all' ||
           filters.quoteStatus !== 'all' ||
           filters.minHours !== null ||
           filters.maxHours !== null ||
           filters.minAmount !== null ||
           filters.maxAmount !== null ||
           filters.hasNotes !== 'all' ||
           filters.selectedTeams.length > 0 ||
           filters.selectedProjects.length > 0;
  };

  const quickFilters = [
    {
      label: 'Non facturées',
      icon: Euro,
      action: () => updateFilter('invoiceStatus', 'pending'),
      active: filters.invoiceStatus === 'pending'
    },
    {
      label: 'Cette semaine',
      icon: Calendar,
      action: () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        updateFilter('dateRange', { from: startOfWeek, to: endOfWeek });
      },
      active: false
    },
    {
      label: 'Devis signés',
      icon: FileText,
      action: () => updateFilter('quoteStatus', 'signed'),
      active: filters.quoteStatus === 'signed'
    },
    {
      label: 'Avec notes',
      icon: Clock,
      action: () => updateFilter('hasNotes', 'yes'),
      active: filters.hasNotes === 'yes'
    }
  ];

  const handleSaveFilter = () => {
    if (saveFilterName.trim()) {
      onSaveFilter(saveFilterName.trim(), filters);
      setSaveFilterName('');
    }
  };

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et Filtres
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Badge variant="secondary">
                {Object.values(filters).filter(v => 
                  v !== '' && v !== 'all' && v !== null && v !== undefined && 
                  (!Array.isArray(v) || v.length > 0)
                ).length} actifs
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters()}
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les fiches, notes, clients, adresses..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((quickFilter, index) => (
            <Button
              key={index}
              variant={quickFilter.active ? 'default' : 'outline'}
              size="sm"
              onClick={quickFilter.action}
              className="flex items-center gap-2"
            >
              <quickFilter.icon className="h-4 w-4" />
              {quickFilter.label}
            </Button>
          ))}
        </div>

        {/* Filtres avancés dans un Sheet */}
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Filtres avancés
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtres avancés</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Plage de dates */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Période
                  </label>
                  <DatePickerWithRange
                    date={filters.dateRange}
                    onDateChange={(dateRange) => updateFilter('dateRange', dateRange)}
                  />
                </div>

                {/* Statut facturation */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Statut facturation
                  </label>
                  <Select
                    value={filters.invoiceStatus}
                    onValueChange={(value) => updateFilter('invoiceStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="invoiced">Facturées</SelectItem>
                      <SelectItem value="pending">Non facturées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut devis */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Statut devis
                  </label>
                  <Select
                    value={filters.quoteStatus}
                    onValueChange={(value) => updateFilter('quoteStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="signed">Signés</SelectItem>
                      <SelectItem value="unsigned">Non signés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plage d'heures */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Nombre d'heures
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minHours || ''}
                      onChange={(e) => updateFilter('minHours', e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxHours || ''}
                      onChange={(e) => updateFilter('maxHours', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>

                {/* Plage de montant */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Montant (€)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ''}
                      onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ''}
                      onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>

                {/* Présence de notes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Remarques/Notes
                  </label>
                  <Select
                    value={filters.hasNotes}
                    onValueChange={(value) => updateFilter('hasNotes', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="yes">Avec notes</SelectItem>
                      <SelectItem value="no">Sans notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Équipes sélectionnées */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Équipes
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {teams.map((team) => (
                      <label key={team.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.selectedTeams.includes(team.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFilter('selectedTeams', [...filters.selectedTeams, team.id]);
                            } else {
                              updateFilter('selectedTeams', filters.selectedTeams.filter(id => id !== team.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{team.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Projets sélectionnés */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Projets
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {projects.slice(0, 10).map((project) => (
                      <label key={project.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFilter('selectedProjects', [...filters.selectedProjects, project.id]);
                            } else {
                              updateFilter('selectedProjects', filters.selectedProjects.filter(id => id !== project.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm truncate">{project.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sauvegarde de filtres */}
          {hasActiveFilters() && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nom du filtre..."
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                className="w-40"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveFilter}
                disabled={!saveFilterName.trim()}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Filtres sauvegardés */}
        {savedFilters.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
              <Star className="h-4 w-4" />
              Filtres favoris
            </label>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((savedFilter) => (
                <div key={savedFilter.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadFilter(savedFilter.filters)}
                    className="flex items-center gap-2"
                  >
                    <Star className="h-3 w-3" />
                    {savedFilter.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteFilter(savedFilter.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges des filtres actifs */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {filters.searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                Recherche: "{filters.searchQuery}"
                <button
                  onClick={() => updateFilter('searchQuery', '')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.invoiceStatus !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Euro className="h-3 w-3" />
                {filters.invoiceStatus === 'invoiced' ? 'Facturées' : 'Non facturées'}
                <button
                  onClick={() => updateFilter('invoiceStatus', 'all')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.dateRange && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Période personnalisée
                <button
                  onClick={() => updateFilter('dateRange', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.selectedTeams.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {filters.selectedTeams.length} équipe{filters.selectedTeams.length > 1 ? 's' : ''}
                <button
                  onClick={() => updateFilter('selectedTeams', [])}
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