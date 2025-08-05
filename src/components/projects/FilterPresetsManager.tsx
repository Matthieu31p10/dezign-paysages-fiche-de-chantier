import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilterPreset } from '@/hooks/useAdvancedFilters';
import { BookmarkIcon, Download, Upload, MoreVertical, Trash2, Edit, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface FilterPresetsManagerProps {
  presets: FilterPreset[];
  currentPreset: string;
  onLoadPreset: (presetId: string) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (presetId: string) => void;
  onDuplicatePreset?: (presetId: string, newName: string) => void;
  onExportPresets?: () => void;
  onImportPresets?: (presets: FilterPreset[]) => void;
}

export const FilterPresetsManager: React.FC<FilterPresetsManagerProps> = ({
  presets,
  currentPreset,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  onDuplicatePreset,
  onExportPresets,
  onImportPresets
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleSaveNew = () => {
    if (newPresetName.trim()) {
      onSavePreset(newPresetName.trim());
      setNewPresetName('');
      toast.success('Préréglage sauvegardé');
    }
  };

  const handleDuplicate = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset && onDuplicatePreset) {
      const newName = `${preset.name} (copie)`;
      onDuplicatePreset(presetId, newName);
      toast.success('Préréglage dupliqué');
    }
  };

  const handleDelete = (presetId: string) => {
    onDeletePreset(presetId);
    toast.success('Préréglage supprimé');
  };

  const handleExport = () => {
    if (onExportPresets) {
      onExportPresets();
      toast.success('Préréglages exportés');
    }
  };

  const nonDefaultPresets = presets.filter(p => !p.isDefault);
  const activeFiltersCount = Object.keys(presets.find(p => p.id === currentPreset)?.filters || {}).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <BookmarkIcon className="h-4 w-4 mr-2" />
          Préréglages
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            Gestion des préréglages de filtres
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sauvegarder nouveau préréglage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nouveau préréglage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du préréglage..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNew()}
                />
                <Button
                  onClick={handleSaveNew}
                  disabled={!newPresetName.trim()}
                >
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des préréglages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Préréglages sauvegardés</CardTitle>
              <div className="flex gap-2">
                {onExportPresets && (
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                )}
                {onImportPresets && (
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {presets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookmarkIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Aucun préréglage sauvegardé</p>
                  </div>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {editingPreset === preset.id ? (
                            <Input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="w-48 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  // Handle rename
                                  setEditingPreset(null);
                                } else if (e.key === 'Escape') {
                                  setEditingPreset(null);
                                  setEditedName('');
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium">{preset.name}</span>
                          )}
                          
                          <div className="flex gap-1">
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
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Object.keys(preset.filters).length} filtre{Object.keys(preset.filters).length > 1 ? 's' : ''}
                          {Object.keys(preset.filters).length > 0 && (
                            <span className="ml-2">
                              • {Object.entries(preset.filters).slice(0, 2).map(([key, value]) => `${key}: ${value}`).join(', ')}
                              {Object.keys(preset.filters).length > 2 && '...'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onLoadPreset(preset.id)}
                          disabled={currentPreset === preset.id}
                        >
                          Charger
                        </Button>
                        
                        {!preset.isDefault && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingPreset(preset.id);
                                  setEditedName(preset.name);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Renommer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(preset.id)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Dupliquer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(preset.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          {presets.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{presets.length}</div>
                    <div className="text-xs text-muted-foreground">Préréglages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{nonDefaultPresets.length}</div>
                    <div className="text-xs text-muted-foreground">Personnalisés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{activeFiltersCount}</div>
                    <div className="text-xs text-muted-foreground">Filtres actifs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterPresetsManager;