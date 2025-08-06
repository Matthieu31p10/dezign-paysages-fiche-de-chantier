
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import PerformanceIndicator from '@/components/projects/PerformanceIndicator';
import BulkActionsBar from '@/components/projects/BulkActionsBar';
import ProjectAnalyticsCard from '@/components/projects/ProjectAnalyticsCard';
import ProjectSkeleton from '@/components/projects/ProjectSkeleton';
import { ProjectDataManager } from '@/components/projects/ProjectDataManager';
import { useProjectsLogic } from '@/components/projects/useProjectsLogic';
import { ProjectsControls } from '@/components/projects/ProjectsControls';
import { usePerformance } from '@/context/PerformanceContext';

const Projects = () => {
  const {
    // Data
    activeProjects,
    archivedProjects,
    filteredProjects,
    teams,
    workLogs,
    projectInfos,
    
    // States
    isFormDialogOpen,
    search,
    selectedType,
    selectedTeam,
    activeTab,
    viewMode,
    isLoading,
    selectedProjects,
    showBulkActions,
    useAdvancedFilters,
    showDataManager,
    showPerformanceIndicator,
    
    // Setters
    setIsFormDialogOpen,
    setSearch,
    setSelectedType,
    setSelectedTeam,
    setActiveTab,
    setViewMode,
    setShowDataManager,
    setShowPerformanceIndicator,
    setShowBulkActions,
    
    // Handlers
    handleSelectProject,
    handleFormSuccess,
    handleProjectSelection,
    handleSelectAll,
    handleClearSelection,
    handleAdvancedFilterChange,
    handleAdvancedFilterReset,
    handleBulkArchive,
    handleBulkDelete,
    handleBulkExport,
  } = useProjectsLogic();

  const { metrics, clearCache, getCacheStats } = usePerformance();

  // Adapt metrics to PerformanceIndicator expected format
  const adaptedMetrics = {
    filterTime: 0,
    sortTime: 0,
    renderTime: metrics.lastRenderTime,
    totalProjects: activeProjects.length + archivedProjects.length,
    filteredProjects: filteredProjects.length
  };

  // Adapt cache stats to expected format
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
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
        aria-label="Navigation entre chantiers actifs et archivés"
      >
        <ProjectsControls
          search={search}
          onSearchChange={setSearch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          teams={teams}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeTab={activeTab}
          projects={activeTab === 'active' ? activeProjects : archivedProjects}
          filteredProjects={filteredProjects}
          allProjects={projectInfos}
          workLogs={workLogs}
          activeProjectsCount={activeProjects.length}
          archivedProjectsCount={archivedProjects.length}
          onAdvancedFilterChange={handleAdvancedFilterChange}
          useAdvancedFilters={useAdvancedFilters}
          onAdvancedFilterReset={handleAdvancedFilterReset}
          showBulkActions={showBulkActions}
          onToggleBulkActions={() => setShowBulkActions(!showBulkActions)}
          selectedProjects={selectedProjects}
          showPerformanceIndicator={showPerformanceIndicator}
          onTogglePerformanceIndicator={() => setShowPerformanceIndicator(!showPerformanceIndicator)}
          showDataManager={showDataManager}
          onToggleDataManager={() => setShowDataManager(!showDataManager)}
          onSelectProject={handleSelectProject}
        />
        
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
