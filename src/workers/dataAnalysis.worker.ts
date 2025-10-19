/**
 * Web Worker pour l'analyse de données
 * Traite les workLogs et projets pour des analyses complexes
 */

export interface DataAnalysisMessage {
  type: 'ANALYZE_PROJECT_STATS' | 'FILTER_AND_SORT' | 'CALCULATE_AGGREGATES';
  payload: {
    workLogs?: any[];
    projects?: any[];
    projectId?: string;
    filters?: {
      searchTerm?: string;
      status?: string;
      team?: string;
    };
    sortBy?: string;
  };
}

export interface DataAnalysisResponse {
  type: 'RESULT' | 'ERROR';
  result?: any;
  error?: string;
}

self.onmessage = (event: MessageEvent<DataAnalysisMessage>) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'ANALYZE_PROJECT_STATS':
        const stats = analyzeProjectStats(
          payload.workLogs || [],
          payload.projectId || ''
        );
        
        self.postMessage({
          type: 'RESULT',
          result: stats
        } as DataAnalysisResponse);
        break;

      case 'FILTER_AND_SORT':
        const filtered = filterAndSortProjects(
          payload.projects || [],
          payload.workLogs || [],
          payload.filters || {},
          payload.sortBy || 'name'
        );
        
        self.postMessage({
          type: 'RESULT',
          result: filtered
        } as DataAnalysisResponse);
        break;

      case 'CALCULATE_AGGREGATES':
        const aggregates = calculateAggregates(
          payload.workLogs || []
        );
        
        self.postMessage({
          type: 'RESULT',
          result: aggregates
        } as DataAnalysisResponse);
        break;

      default:
        throw new Error(`Unknown analysis type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as DataAnalysisResponse);
  }
};

// Analysis functions
function analyzeProjectStats(workLogs: any[], projectId: string) {
  const projectLogs = workLogs.filter(log => log.projectId === projectId && !log.isBlankWorksheet);
  
  const totalHours = projectLogs.reduce((sum, log) => 
    sum + (log.timeTracking?.totalHours || 0), 0
  );
  
  const totalVisits = projectLogs.length;
  const averageHours = totalVisits > 0 ? totalHours / totalVisits : 0;
  
  const lastVisit = projectLogs.length > 0 
    ? projectLogs.reduce((latest, log) => 
        new Date(log.date) > new Date(latest.date) ? log : latest
      )
    : null;

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    totalVisits,
    averageHours: Math.round(averageHours * 100) / 100,
    lastVisitDate: lastVisit?.date || null
  };
}

function filterAndSortProjects(
  projects: any[],
  workLogs: any[],
  filters: { searchTerm?: string; status?: string; team?: string },
  sortBy: string
) {
  let filtered = [...projects];

  // Apply filters
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(term) ||
      p.client?.toLowerCase().includes(term) ||
      p.address?.toLowerCase().includes(term)
    );
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(p => p.status === filters.status);
  }

  if (filters.team && filters.team !== 'all') {
    filtered = filtered.filter(p => p.team === filters.team);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'client':
        return (a.client || '').localeCompare(b.client || '');
      case 'lastVisit': {
        const aLogs = workLogs.filter(log => log.projectId === a.id);
        const bLogs = workLogs.filter(log => log.projectId === b.id);
        const aLast = aLogs.length > 0 ? Math.max(...aLogs.map(log => new Date(log.date).getTime())) : 0;
        const bLast = bLogs.length > 0 ? Math.max(...bLogs.map(log => new Date(log.date).getTime())) : 0;
        return bLast - aLast;
      }
      default:
        return 0;
    }
  });

  return filtered;
}

function calculateAggregates(workLogs: any[]) {
  const realLogs = workLogs.filter(log => !log.isBlankWorksheet);
  
  const totalHours = realLogs.reduce((sum, log) => 
    sum + (log.timeTracking?.totalHours || 0), 0
  );
  
  const totalVisits = realLogs.length;
  
  const projectsSet = new Set(realLogs.map(log => log.projectId));
  const totalProjects = projectsSet.size;
  
  const byMonth: Record<string, { hours: number; visits: number }> = {};
  
  realLogs.forEach(log => {
    const date = new Date(log.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = { hours: 0, visits: 0 };
    }
    
    byMonth[monthKey].hours += log.timeTracking?.totalHours || 0;
    byMonth[monthKey].visits += 1;
  });

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    totalVisits,
    totalProjects,
    averageHoursPerVisit: totalVisits > 0 ? Math.round((totalHours / totalVisits) * 100) / 100 : 0,
    byMonth
  };
}
