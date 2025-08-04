import { useMemo, useState, useCallback, useRef } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { getDaysSinceLastEntry } from '@/utils/date-helpers';
import { useMemoryCache } from './useMemoryCache';

// Interface pour les métriques de performance
interface PerformanceMetrics {
  filterTime: number;
  sortTime: number;
  renderTime: number;
  totalProjects: number;
  filteredProjects: number;
}

// Hook personnalisé pour optimiser les performances des projets
export const useProjectsPerformance = (projectInfos: ProjectInfo[], workLogs: WorkLog[]) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    filterTime: 0,
    sortTime: 0,
    renderTime: 0,
    totalProjects: 0,
    filteredProjects: 0
  });

  const cache = useMemoryCache();
  const startTimeRef = useRef<number>(0);

  // Cache des types de projets
  const projectTypes = useMemo(() => {
    const cacheKey = 'project-types';
    return cache.get(cacheKey, () => {
      const types = projectInfos
        .map(project => project.projectType)
        .filter(Boolean) as string[];
      return [...new Set(types)];
    });
  }, [projectInfos, cache]);

  // Fonction de filtrage optimisée avec mesure de performance
  const filterProjects = useCallback((
    projects: ProjectInfo[],
    selectedTeam: string,
    selectedProjectType: string,
    searchTerm: string = ''
  ) => {
    const start = performance.now();
    
    const cacheKey = `filtered-${selectedTeam}-${selectedProjectType}-${searchTerm}`;
    
    const filtered = cache.get(cacheKey, () => {
      return projects.filter(project => {
        const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
        const matchesType = selectedProjectType === 'all' || project.projectType === selectedProjectType;
        const matchesSearch = !searchTerm || 
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesTeam && matchesType && matchesSearch;
      });
    });

    const filterTime = performance.now() - start;
    
    setMetrics(prev => ({
      ...prev,
      filterTime,
      totalProjects: projects.length,
      filteredProjects: filtered.length
    }));

    return filtered;
  }, [cache]);

  // Fonction de tri optimisée avec mesure de performance
  const sortProjects = useCallback((
    projects: ProjectInfo[],
    sortOption: string
  ) => {
    const start = performance.now();
    
    const cacheKey = `sorted-${sortOption}-${projects.length}`;
    
    const sorted = cache.get(cacheKey, () => {
      return [...projects].sort((a, b) => {
        switch (sortOption) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'lastVisit': {
            const logsA = workLogs.filter(log => log.projectId === a.id);
            const logsB = workLogs.filter(log => log.projectId === b.id);
            
            const daysA = getDaysSinceLastEntry(logsA);
            const daysB = getDaysSinceLastEntry(logsB);
            
            const numDaysA = typeof daysA === 'number' ? daysA : Number.MAX_SAFE_INTEGER;
            const numDaysB = typeof daysB === 'number' ? daysB : Number.MAX_SAFE_INTEGER;
            
            return numDaysA - numDaysB;
          }
          case 'annualVisits':
            return (b.annualVisits || 0) - (a.annualVisits || 0);
          case 'annualHours':
            return (b.annualTotalHours || 0) - (a.annualTotalHours || 0);
          case 'created':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          default:
            return 0;
        }
      });
    });

    const sortTime = performance.now() - start;
    
    setMetrics(prev => ({
      ...prev,
      sortTime
    }));

    return sorted;
  }, [workLogs, cache]);

  // Mesure du temps de rendu
  const startRenderMeasure = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    if (startTimeRef.current > 0) {
      const renderTime = performance.now() - startTimeRef.current;
      setMetrics(prev => ({
        ...prev,
        renderTime
      }));
      startTimeRef.current = 0;
    }
  }, []);

  // Fonction pour vider le cache
  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  // Fonction pour obtenir les statistiques du cache
  const getCacheStats = useCallback(() => {
    return cache.getStats();
  }, [cache]);

  return {
    projectTypes,
    filterProjects,
    sortProjects,
    startRenderMeasure,
    endRenderMeasure,
    clearCache,
    getCacheStats,
    metrics
  };
};

export default useProjectsPerformance;