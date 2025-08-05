
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useProjectsPerformance } from '@/hooks/useProjectsPerformance';
import { ProjectInfo } from '@/types/models';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsViewToggle from '@/components/projects/ProjectsViewToggle';
import ProjectsTabs from '@/components/projects/ProjectsTabs';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import PerformanceIndicator from '@/components/projects/PerformanceIndicator';
import BulkActionsBar from '@/components/projects/BulkActionsBar';
import ProjectAnalyticsCard from '@/components/projects/ProjectAnalyticsCard';
import ProjectSkeleton from '@/components/projects/ProjectSkeleton';
import AdvancedFiltersPanel from '@/components/projects/AdvancedFiltersPanel';
import GlobalSearchDialog from '@/components/projects/GlobalSearchDialog';
import FilterPresetsManager from '@/components/projects/FilterPresetsManager';
import ProjectExportDialog from '@/components/projects/ProjectExportDialog';
import { ProjectDataManager } from '@/components/projects/ProjectDataManager';
import { useProjectDataValidation } from '@/hooks/useProjectDataValidation';
import { useProjectSync } from '@/hooks/useProjectSync';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects, teams, workLogs } = useApp();
  
  // Hook de performance optimisé - avec protection contre les données nulles
  const {
    filterProjects,
    sortProjects,
    startRenderMeasure,
    endRenderMeasure,
    clearCache,
    getCacheStats,
    metrics
  } = useProjectsPerformance(projectInfos || [], workLogs || []);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('name');
  const [showPerformanceIndicator, setShowPerformanceIndicator] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  const [advancedFilteredProjects, setAdvancedFilteredProjects] = useState<ProjectInfo[]>([]);
  const [useAdvancedFilters, setUseAdvancedFilters] = useState<boolean>(false);
  const [showDataManager, setShowDataManager] = useState<boolean>(false);

  // Data validation and sync hooks - avec protection
  const { validateBeforeSave } = useProjectDataValidation();
  const { syncStatus, addPendingChange } = useProjectSync();
  
  const activeProjects = getActiveProjects() || [];
  const archivedProjects = getArchivedProjects() || [];

  // Utilisation des fonctions optimisées
  const getFilteredAndSortedProjects = () => {
    startRenderMeasure();
    
    const projectsToFilter = activeTab === 'active' ? activeProjects : archivedProjects;
    
    // Si les filtres avancés sont actifs, utiliser les résultats filtrés avancés
    if (useAdvancedFilters && advancedFilteredProjects.length > 0) {
      const filtered = advancedFilteredProjects.filter(project => 
        projectsToFilter.some(p => p.id === project.id)
      );
      const sorted = sortProjects(filtered, sortOption);
      endRenderMeasure();
      return sorted;
    }
    
    // Sinon utiliser le filtrage standard
    const filtered = filterProjects(projectsToFilter, selectedTeam, selectedType, search);
    const sorted = sortProjects(filtered, sortOption);
    
    endRenderMeasure();
    return sorted;
  };
  
  const filteredProjects = getFilteredAndSortedProjects();
  
  const handleSelectProject = (id: string) => {
    selectProject(id);
    navigate('/worklogs/new');
  };
  
  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
  };

  const handleClearCache = () => {
    clearCache();
  };

  // Gestion de la sélection multiple
  const handleProjectSelection = (projectId: string, selected: boolean) => {
    setSelectedProjects(prev => 
      selected 
        ? [...prev, projectId]
        : prev.filter(id => id !== projectId)
    );
  };

  const handleSelectAll = () => {
    setSelectedProjects(filteredProjects.map(p => p.id));
  };

  const handleClearSelection = () => {
    setSelectedProjects([]);
    setShowBulkActions(false);
  };

  const handleBulkArchive = async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      // Logique d'archivage en lot
      console.log('Archiving projects:', projectIds);
      // await bulkArchiveProjects(projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      // Logique de suppression en lot
      console.log('Deleting projects:', projectIds);
      // await bulkDeleteProjects(projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = async (projectIds: string[]) => {
    console.log('Exporting projects:', projectIds);
    // Logique d'export
  };

  // Gestion des filtres avancés
  const handleAdvancedFilterChange = (filtered: ProjectInfo[]) => {
    setAdvancedFilteredProjects(filtered);
    setUseAdvancedFilters(true);
  };

  const handleAdvancedFilterReset = () => {
    setAdvancedFilteredProjects([]);
    setUseAdvancedFilters(false);
  };

  // Effet pour afficher/masquer la barre d'actions
  useEffect(() => {
    setShowBulkActions(selectedProjects.length > 0);
  }, [selectedProjects.length]);

  // Mesure de performance au changement des dépendances
  useEffect(() => {
    endRenderMeasure();
  }, [filteredProjects.length, endRenderMeasure]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ProjectsHeader 
        isFormDialogOpen={isFormDialogOpen}
        onFormDialogChange={setIsFormDialogOpen}
        onFormSuccess={handleFormSuccess}
      />

      {/* Tableau de bord analytique */}
      <ProjectAnalyticsCard
        projects={filteredProjects}
        workLogs={workLogs}
        className="mb-6"
      />

      {/* Indicateur de performance (développement) */}
      <PerformanceIndicator
        metrics={metrics}
        cacheStats={getCacheStats()}
        onClearCache={handleClearCache}
        visible={showPerformanceIndicator}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
          {/* Recherche et filtres de base */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            <ProjectsFilters
              search={search}
              onSearchChange={setSearch}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedTeam={selectedTeam}
              onTeamChange={setSelectedTeam}
              teams={teams}
            />
            
            {/* Recherche globale et filtres avancés */}
            <div className="flex items-center gap-2">
              <GlobalSearchDialog
                projects={projectInfos}
                workLogs={workLogs}
                teams={teams}
                onSelectProject={handleSelectProject}
              />
              
              <AdvancedFiltersPanel
                projects={activeTab === 'active' ? activeProjects : archivedProjects}
                onFilteredDataChange={handleAdvancedFilterChange}
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
              onViewModeChange={setViewMode}
            />

            {/* Toggle pour mode sélection */}
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className={cn(
                "px-3 py-1 text-xs rounded transition-colors",
                showBulkActions 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              )}
              title="Mode sélection multiple"
            >
              ☑️
            </button>

            {/* Toggle pour les métriques de performance */}
            <button
              onClick={() => setShowPerformanceIndicator(!showPerformanceIndicator)}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              title="Afficher/masquer les métriques de performance"
            >
              📊
            </button>

            {/* Data Manager Toggle */}
            <button
              onClick={() => setShowDataManager(!showDataManager)}
              className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
              title="Gestionnaire de données"
            >
              🗂️
            </button>
            
            <ProjectsTabs
              activeProjectsCount={activeProjects.length}
              archivedProjectsCount={archivedProjects.length}
            />
          </div>
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
            <button
              onClick={handleAdvancedFilterReset}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Réinitialiser
            </button>
          </div>
        )}
        
        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <ProjectSkeleton viewMode={viewMode} count={6} />
          ) : filteredProjects.length === 0 ? (
            <ProjectsEmptyState
              type="active"
              hasProjects={activeProjects.length > 0}
              onCreateProject={() => setIsFormDialogOpen(true)}
            />
          ) : (
            <ProjectsGrid
              projects={filteredProjects}
              viewMode={viewMode}
              onSelectProject={handleSelectProject}
              enableVirtualization={true}
              virtualizationThreshold={20}
              selectedProjects={selectedProjects}
              onProjectSelection={handleProjectSelection}
              showSelectionMode={showBulkActions}
            />
          )}
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          {isLoading ? (
            <ProjectSkeleton viewMode={viewMode} count={6} />
          ) : filteredProjects.length === 0 ? (
            <ProjectsEmptyState
              type="archived"
              hasProjects={archivedProjects.length > 0}
              onCreateProject={() => setIsFormDialogOpen(true)}
            />
          ) : (
            <ProjectsGrid
              projects={filteredProjects}
              viewMode={viewMode}
              onSelectProject={handleSelectProject}
              enableVirtualization={true}
              virtualizationThreshold={20}
              selectedProjects={selectedProjects}
              onProjectSelection={handleProjectSelection}
              showSelectionMode={showBulkActions}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Barre d'actions en lot */}
      <BulkActionsBar
        selectedProjects={selectedProjects}
        projects={filteredProjects}
        onClearSelection={handleClearSelection}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onSelectAll={handleSelectAll}
        isVisible={showBulkActions && selectedProjects.length > 0}
      />

      {/* Data Manager Dialog */}
      {showDataManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gestionnaire de données</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDataManager(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <ProjectDataManager
                projects={projectInfos}
                workLogs={workLogs}
                onProjectsUpdate={(updatedProjects) => {
                  // Handle projects update
                  console.log('Projects updated:', updatedProjects);
                }}
                onWorkLogsUpdate={(updatedWorkLogs) => {
                  // Handle work logs update
                  console.log('Work logs updated:', updatedWorkLogs);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
