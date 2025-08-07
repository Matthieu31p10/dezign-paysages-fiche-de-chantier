
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button-enhanced';
import { FileText, Archive, Search, Filter, Users, Eye, Calendar, BarChart3, Database, Grid3X3, List, Settings } from 'lucide-react';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import PerformanceIndicator from '@/components/projects/PerformanceIndicator';
import BulkActionsBar from '@/components/projects/BulkActionsBar';
import ProjectAnalyticsCard from '@/components/projects/ProjectAnalyticsCard';
import ProjectSkeleton from '@/components/projects/ProjectSkeleton';
import { ProjectDataManager } from '@/components/projects/ProjectDataManager';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsViewToggle from '@/components/projects/ProjectsViewToggle';
import AdvancedFiltersPanel from '@/components/projects/AdvancedFiltersPanel';
import GlobalSearchDialog from '@/components/projects/GlobalSearchDialog';
import FilterPresetsManager from '@/components/projects/FilterPresetsManager';
import ProjectExportDialog from '@/components/projects/ProjectExportDialog';
import { useApp } from '@/context/AppContext';
import { usePerformance } from '@/context/PerformanceContext';
import { ProjectInfo } from '@/types/models';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects, teams, workLogs } = useApp();
  
  // States unifiés dans la page
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('name');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  const [advancedFilteredProjects, setAdvancedFilteredProjects] = useState<ProjectInfo[]>([]);
  const [useAdvancedFilters, setUseAdvancedFilters] = useState<boolean>(false);
  const [showDataManager, setShowDataManager] = useState<boolean>(false);
  const [showPerformanceIndicator, setShowPerformanceIndicator] = useState<boolean>(false);

  const activeProjects = getActiveProjects() || [];
  const archivedProjects = getArchivedProjects() || [];

  // Logique de filtrage intégrée
  const filterProjects = useCallback((projects: ProjectInfo[], team: string, type: string, searchTerm?: string) => {
    return projects.filter(project => {
      const matchesTeam = team === 'all' || project.team === team;
      const matchesType = type === 'all' || project.projectType === type;
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTeam && matchesType && matchesSearch;
    });
  }, []);

  const sortProjects = useCallback((projects: ProjectInfo[], option: string) => {
    return [...projects].sort((a, b) => {
      switch (option) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'team':
          return (a.team || '').localeCompare(b.team || '');
        default:
          return 0;
      }
    });
  }, []);

  const getFilteredAndSortedProjects = useCallback(() => {
    const projectsToFilter = activeTab === 'active' ? activeProjects : archivedProjects;
    
    if (useAdvancedFilters && advancedFilteredProjects.length > 0) {
      const filtered = advancedFilteredProjects.filter(project => 
        projectsToFilter.some(p => p.id === project.id)
      );
      return sortProjects(filtered, sortOption);
    }
    
    const filtered = filterProjects(projectsToFilter, selectedTeam, selectedType, search);
    return sortProjects(filtered, sortOption);
  }, [
    activeTab, activeProjects, archivedProjects, useAdvancedFilters, 
    advancedFilteredProjects, sortProjects, filterProjects, 
    selectedTeam, selectedType, search, sortOption
  ]);

  const filteredProjects = getFilteredAndSortedProjects();

  // Handlers intégrés
  const handleSelectProject = useCallback((id: string) => {
    selectProject(id);
    navigate('/worklogs/new');
  }, [selectProject, navigate]);
  
  const handleFormSuccess = useCallback(() => {
    setIsFormDialogOpen(false);
  }, []);

  const handleProjectSelection = useCallback((projectId: string, selected: boolean) => {
    setSelectedProjects(prev => 
      selected 
        ? [...prev, projectId]
        : prev.filter(id => id !== projectId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProjects(filteredProjects.map(p => p.id));
  }, [filteredProjects]);

  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
    setShowBulkActions(false);
  }, []);

  const handleAdvancedFilterChange = useCallback((filtered: ProjectInfo[]) => {
    setAdvancedFilteredProjects(filtered);
    setUseAdvancedFilters(true);
  }, []);

  const handleAdvancedFilterReset = useCallback(() => {
    setAdvancedFilteredProjects([]);
    setUseAdvancedFilters(false);
  }, []);

  const handleBulkArchive = useCallback(async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      console.log('Archiving projects:', projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  }, [handleClearSelection]);

  const handleBulkDelete = useCallback(async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      console.log('Deleting projects:', projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  }, [handleClearSelection]);

  const handleBulkExport = useCallback(async (projectIds: string[]) => {
    console.log('Exporting projects:', projectIds);
  }, []);

  // Effects
  useEffect(() => {
    setShowBulkActions(selectedProjects.length > 0);
  }, [selectedProjects.length]);

  const { metrics, clearCache, getCacheStats } = usePerformance();

  const adaptedMetrics = {
    filterTime: 0,
    sortTime: 0,
    renderTime: metrics.lastRenderTime,
    totalProjects: activeProjects.length + archivedProjects.length,
    filteredProjects: filteredProjects.length
  };

  const adaptedCacheStats = {
    ...getCacheStats(),
    hits: 0,
    misses: 0
  };

  const handleClearCache = () => {
    clearCache();
  };
  
  return (
    <div className="space-y-6 animate-fade-in" role="main" aria-label="Gestion des chantiers">
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
        metrics={adaptedMetrics}
        cacheStats={adaptedCacheStats}
        onClearCache={handleClearCache}
        visible={showPerformanceIndicator}
      />
      
      {/* Contrôles unifiés */}
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

          <Button
            variant={showBulkActions ? "gradient-primary" : "outline"}
            size="sm"
            onClick={() => setShowBulkActions(!showBulkActions)}
            aria-label="Activer le mode sélection multiple"
            title="Mode sélection multiple"
            animation="hover"
          >
            ☑️
          </Button>

          <Button
            variant={showPerformanceIndicator ? "gradient-primary" : "outline"}
            size="sm"
            onClick={() => setShowPerformanceIndicator(!showPerformanceIndicator)}
            aria-label="Afficher les métriques de performance"
            title="Afficher/masquer les métriques de performance"
            animation="hover"
          >
            📊
          </Button>

          <Button
            variant={showDataManager ? "gradient-primary" : "outline"}
            size="sm"
            onClick={() => setShowDataManager(!showDataManager)}
            aria-label="Ouvrir le gestionnaire de données"
            title="Gestionnaire de données"
            animation="hover"
          >
            🗂️
          </Button>
        </div>

        {/* Indicateur de filtres avancés actifs */}
        {useAdvancedFilters && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                Filtres avancés actifs
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {filteredProjects.length} résultat{filteredProjects.length > 1 ? 's' : ''}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdvancedFilterReset}
              aria-label="Réinitialiser les filtres avancés"
              animation="hover"
            >
              Réinitialiser
            </Button>
          </div>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
        aria-label="Navigation entre chantiers actifs et archivés"
      >
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Actifs ({activeProjects.length})</span>
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-1">
            <Archive className="h-4 w-4" />
            <span>Archivés ({archivedProjects.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="active" 
          className="mt-0"
          role="tabpanel"
          aria-label="Liste des chantiers actifs"
        >
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
        
        <TabsContent 
          value="archived" 
          className="mt-0"
          role="tabpanel"
          aria-label="Liste des chantiers archivés"
        >
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
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="data-manager-title"
          aria-modal="true"
        >
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 id="data-manager-title" className="text-lg font-semibold">
                Gestionnaire de données
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDataManager(false)}
                aria-label="Fermer le gestionnaire de données"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <ProjectDataManager
                projects={projectInfos}
                workLogs={workLogs}
                onProjectsUpdate={(updatedProjects) => {
                  console.log('Projects updated:', updatedProjects);
                }}
                onWorkLogsUpdate={(updatedWorkLogs) => {
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
