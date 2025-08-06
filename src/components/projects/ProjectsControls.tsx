import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ProjectsFilters from './ProjectsFilters';
import ProjectsViewToggle from './ProjectsViewToggle';
import ProjectsTabs from './ProjectsTabs';
import AdvancedFiltersPanel from './AdvancedFiltersPanel';
import GlobalSearchDialog from './GlobalSearchDialog';
import FilterPresetsManager from './FilterPresetsManager';
import ProjectExportDialog from './ProjectExportDialog';
import { ProjectInfo, WorkLog, Team } from '@/types/models';

interface ProjectsControlsProps {
  // Search and filters
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  teams: Team[];
  
  // View controls
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeTab: string;
  
  // Projects data
  projects: ProjectInfo[];
  filteredProjects: ProjectInfo[];
  allProjects: ProjectInfo[];
  workLogs: WorkLog[];
  activeProjectsCount: number;
  archivedProjectsCount: number;
  
  // Advanced filters
  onAdvancedFilterChange: (filtered: ProjectInfo[]) => void;
  useAdvancedFilters: boolean;
  onAdvancedFilterReset: () => void;
  
  // Bulk actions
  showBulkActions: boolean;
  onToggleBulkActions: () => void;
  selectedProjects: string[];
  
  // Performance
  showPerformanceIndicator: boolean;
  onTogglePerformanceIndicator: () => void;
  
  // Data manager
  showDataManager: boolean;
  onToggleDataManager: () => void;
  
  // Handlers
  onSelectProject: (id: string) => void;
}

export const ProjectsControls: React.FC<ProjectsControlsProps> = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedTeam,
  onTeamChange,
  teams,
  viewMode,
  onViewModeChange,
  activeTab,
  projects,
  filteredProjects,
  allProjects,
  workLogs,
  activeProjectsCount,
  archivedProjectsCount,
  onAdvancedFilterChange,
  useAdvancedFilters,
  onAdvancedFilterReset,
  showBulkActions,
  onToggleBulkActions,
  selectedProjects,
  showPerformanceIndicator,
  onTogglePerformanceIndicator,
  showDataManager,
  onToggleDataManager,
  onSelectProject,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
      {/* Recherche et filtres de base */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        <ProjectsFilters
          search={search}
          onSearchChange={onSearchChange}
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          selectedTeam={selectedTeam}
          onTeamChange={onTeamChange}
          teams={teams}
        />
        
        {/* Recherche globale et filtres avancés */}
        <div className="flex items-center gap-2">
          <GlobalSearchDialog
            projects={allProjects}
            workLogs={workLogs}
            teams={teams}
            onSelectProject={onSelectProject}
          />
          
          <AdvancedFiltersPanel
            projects={projects}
            onFilteredDataChange={onAdvancedFilterChange}
            teams={teams}
          />
          
          <FilterPresetsManager
            presets={[]}
            currentPreset=""
            onLoadPreset={() => {}}
            onSavePreset={() => {}}
            onDeletePreset={() => {}}
          />
          
          <ProjectExportDialog
            projects={filteredProjects}
            selectedProjects={selectedProjects}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ProjectsViewToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        {/* Toggle pour mode sélection */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBulkActions}
          className={cn(
            "transition-colors",
            showBulkActions 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary"
          )}
          aria-label="Activer le mode sélection multiple"
          title="Mode sélection multiple"
        >
          ☑️
        </Button>

        {/* Toggle pour les métriques de performance */}
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePerformanceIndicator}
          className="bg-secondary"
          aria-label="Afficher les métriques de performance"
          title="Afficher/masquer les métriques de performance"
        >
          📊
        </Button>

        {/* Data Manager Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDataManager}
          className="bg-secondary"
          aria-label="Ouvrir le gestionnaire de données"
          title="Gestionnaire de données"
        >
          🗂️
        </Button>
        
        <ProjectsTabs
          activeProjectsCount={activeProjectsCount}
          archivedProjectsCount={archivedProjectsCount}
        />
      </div>

      {/* Indicateur de filtres avancés actifs */}
      {useAdvancedFilters && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-700">
              Filtres avancés actifs
            </span>
            <span className="text-xs text-blue-600">
              {filteredProjects.length} résultat{filteredProjects.length > 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdvancedFilterReset}
            className="text-xs text-blue-600 hover:text-blue-800 underline h-auto p-0"
            aria-label="Réinitialiser les filtres avancés"
          >
            Réinitialiser
          </Button>
        </div>
      )}
    </div>
  );
};