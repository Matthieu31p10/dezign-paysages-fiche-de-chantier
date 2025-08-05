import React, { memo, useMemo, useCallback } from 'react';
import { ProjectInfo } from '@/types/models';
import { VirtualizedProjectsList } from './VirtualizedProjectsList';
import ProjectSkeleton from './ProjectSkeleton';
import { useProjectsPerformance } from '@/hooks/useProjectsPerformance';
import { useProjectsCache } from '@/hooks/useProjectsCache';
import PerformanceIndicator from './PerformanceIndicator';

interface OptimizedProjectsGridProps {
  projects: ProjectInfo[];
  selectedProjects: Set<string>;
  onProjectSelect: (projectId: string) => void;
  onProjectClick: (project: ProjectInfo) => void;
  filters?: any;
  isLoading?: boolean;
  useVirtualization?: boolean;
  showPerformanceMetrics?: boolean;
}

const OptimizedProjectsGrid: React.FC<OptimizedProjectsGridProps> = memo(({
  projects,
  selectedProjects,
  onProjectSelect,
  onProjectClick,
  filters = {},
  isLoading = false,
  useVirtualization = true,
  showPerformanceMetrics = false
}) => {
  const { 
    metrics, 
    performanceFilter, 
    performanceSort, 
    performanceIndicators 
  } = useProjectsPerformance(projects, []);
  
  const { 
    getCachedData, 
    setCachedData, 
    generateCacheKey, 
    clearCache,
    stats: cacheStats 
  } = useProjectsCache(projects);

  // Memoized filtered and sorted projects with caching
  const processedProjects = useMemo(() => {
    const cacheKey = generateCacheKey(filters);
    const cached = getCachedData(cacheKey);
    
    if (cached && cached.projects === projects) {
      return cached.filteredProjects;
    }

    // Apply filters with performance tracking
    const filtered = performanceFilter(projects, (project) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          project.name.toLowerCase().includes(searchLower) ||
          project.clientName?.toLowerCase().includes(searchLower) ||
          project.address.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.status) {
        const isArchived = project.isArchived;
        return filters.status === 'archived' ? isArchived : !isArchived;
      }
      
      if (filters.projectType && filters.projectType !== 'all') {
        return project.projectType === filters.projectType;
      }
      
      return true;
    });

    // Apply sorting with performance tracking
    const sorted = performanceSort(filtered, (a, b) => {
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      
      let aValue = a[sortBy as keyof ProjectInfo];
      let bValue = b[sortBy as keyof ProjectInfo];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'desc' ? -result : result;
    });

    // Cache the results
    setCachedData(cacheKey, {
      projects,
      filteredProjects: sorted
    });

    return sorted;
  }, [projects, filters, performanceFilter, performanceSort, getCachedData, setCachedData, generateCacheKey]);

  const handleProjectSelect = useCallback((projectId: string) => {
    onProjectSelect(projectId);
  }, [onProjectSelect]);

  const handleProjectClick = useCallback((project: ProjectInfo) => {
    onProjectClick(project);
  }, [onProjectClick]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <ProjectSkeleton key={i} viewMode="grid" count={1} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showPerformanceMetrics && (
        <PerformanceIndicator
          metrics={metrics}
          cacheStats={cacheStats}
          onClearCache={clearCache}
          visible={showPerformanceMetrics}
        />
      )}
      
      {useVirtualization && processedProjects.length > 20 ? (
        <VirtualizedProjectsList
          projects={processedProjects}
          selectedProjects={selectedProjects}
          onProjectSelect={handleProjectSelect}
          onProjectClick={handleProjectClick}
          height={600}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedProjects.map((project) => (
            <ProjectSkeleton key={project.id} viewMode="grid" count={1} />
          ))}
        </div>
      )}
    </div>
  );
});

OptimizedProjectsGrid.displayName = 'OptimizedProjectsGrid';

export { OptimizedProjectsGrid };