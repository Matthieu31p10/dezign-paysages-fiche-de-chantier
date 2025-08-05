import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';

interface PerformanceMetrics {
  filterTime: number;
  sortTime: number;
  renderTime: number;
  totalProjects: number;
  filteredProjects: number;
}

interface PerformanceIndicators {
  isSlowFilter: boolean;
  isSlowSort: boolean;
  isSlowRender: boolean;
  totalTime: number;
}

export const useProjectsPerformance = (projects: ProjectInfo[], workLogs: WorkLog[]) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    filterTime: 0,
    sortTime: 0,
    renderTime: 0,
    totalProjects: 0,
    filteredProjects: 0
  });

  // Legacy compatibility methods for existing code
  const filterProjects = useCallback((
    projects: ProjectInfo[],
    selectedTeam: string,
    selectedType: string,
    searchTerm?: string
  ) => {
    return performanceFilter(projects, (project) => {
      if (selectedTeam !== 'all') {
        // Filter by team logic here
      }
      if (selectedType !== 'all' && project.projectType !== selectedType) {
        return false;
      }
      if (searchTerm) {
        return project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               project.address.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, []);

  const sortProjects = useCallback((projects: ProjectInfo[], sortOption: string) => {
    return performanceSort(projects, (a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
  }, []);

  const startRenderMeasure = useCallback(() => {
    // Legacy compatibility
  }, []);

  const endRenderMeasure = useCallback(() => {
    // Legacy compatibility
  }, []);

  const clearCache = useCallback(() => {
    // Legacy compatibility
  }, []);

  const getCacheStats = useCallback(() => {
    return { size: 0, hits: 0, misses: 0, hitRate: 0 };
  }, []);

  // Get project types for filtering
  const projectTypes = useMemo(() => {
    const types = [...new Set(projects.map(p => p.projectType).filter(Boolean))];
    return types;
  }, [projects]);

  // Performance measurement utility
  const measurePerformance = useCallback((name: string, fn: () => any) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      [`${name}Time`]: end - start
    }));
    
    return result;
  }, []);

  // Optimized filtering with performance tracking
  const performanceFilter = useCallback((
    projects: ProjectInfo[],
    filterFn: (project: ProjectInfo) => boolean
  ) => {
    return measurePerformance('filter', () => {
      const filtered = projects.filter(filterFn);
      setMetrics(prev => ({
        ...prev,
        totalProjects: projects.length,
        filteredProjects: filtered.length
      }));
      return filtered;
    });
  }, [measurePerformance]);

  // Optimized sorting with performance tracking
  const performanceSort = useCallback((
    projects: ProjectInfo[],
    sortFn: (a: ProjectInfo, b: ProjectInfo) => number
  ) => {
    return measurePerformance('sort', () => {
      return [...projects].sort(sortFn);
    });
  }, [measurePerformance]);

  // Track render performance
  useEffect(() => {
    const start = performance.now();
    
    // Use requestAnimationFrame to measure actual render time
    requestAnimationFrame(() => {
      const end = performance.now();
      setMetrics(prev => ({
        ...prev,
        renderTime: end - start
      }));
    });
  }, [projects]);

  // Memoized performance indicators
  const performanceIndicators = useMemo((): PerformanceIndicators => {
    const { filterTime, sortTime, renderTime } = metrics;
    
    return {
      isSlowFilter: filterTime > 100,
      isSlowSort: sortTime > 50,
      isSlowRender: renderTime > 16, // 60fps = 16ms per frame
      totalTime: filterTime + sortTime + renderTime
    };
  }, [metrics]);

  return {
    projectTypes,
    filterProjects,
    sortProjects,
    startRenderMeasure,
    endRenderMeasure,
    clearCache,
    getCacheStats,
    metrics,
    performanceFilter,
    performanceSort,
    performanceIndicators,
    measurePerformance
  };
};