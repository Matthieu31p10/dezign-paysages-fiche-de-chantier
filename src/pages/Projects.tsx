
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useProjectsPerformance } from '@/hooks/useProjectsPerformance';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsViewToggle from '@/components/projects/ProjectsViewToggle';
import ProjectsTabs from '@/components/projects/ProjectsTabs';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import PerformanceIndicator from '@/components/projects/PerformanceIndicator';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects, teams, workLogs } = useApp();
  
  // Hook de performance optimisé
  const {
    filterProjects,
    sortProjects,
    startRenderMeasure,
    endRenderMeasure,
    clearCache,
    getCacheStats,
    metrics
  } = useProjectsPerformance(projectInfos, workLogs);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('name');
  const [showPerformanceIndicator, setShowPerformanceIndicator] = useState<boolean>(false);
  
  const activeProjects = getActiveProjects();
  const archivedProjects = getArchivedProjects();

  // Utilisation des fonctions optimisées
  const getFilteredAndSortedProjects = () => {
    startRenderMeasure();
    
    const projectsToFilter = activeTab === 'active' ? activeProjects : archivedProjects;
    
    // Filtrage optimisé avec cache
    const filtered = filterProjects(projectsToFilter, selectedTeam, selectedType, search);
    
    // Tri optimisé avec cache
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

      {/* Indicateur de performance (développement) */}
      <PerformanceIndicator
        metrics={metrics}
        cacheStats={getCacheStats()}
        onClearCache={handleClearCache}
        visible={showPerformanceIndicator}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <ProjectsFilters
            search={search}
            onSearchChange={setSearch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
            teams={teams}
          />
          
          <div className="ml-auto flex items-center gap-2">
            <ProjectsViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Toggle pour les métriques de performance */}
            <button
              onClick={() => setShowPerformanceIndicator(!showPerformanceIndicator)}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              title="Afficher/masquer les métriques de performance"
            >
              📊
            </button>
            
            <ProjectsTabs
              activeProjectsCount={activeProjects.length}
              archivedProjectsCount={archivedProjects.length}
            />
          </div>
        </div>
        
        <TabsContent value="active" className="mt-0">
          {filteredProjects.length === 0 ? (
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
            />
          )}
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          {filteredProjects.length === 0 ? (
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
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
