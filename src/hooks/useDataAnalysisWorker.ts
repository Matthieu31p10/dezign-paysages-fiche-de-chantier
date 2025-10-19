import { useCallback, useState } from 'react';
import { useWebWorker } from './useWebWorker';
import type { DataAnalysisMessage, DataAnalysisResponse } from '@/workers/dataAnalysis.worker';

/**
 * Hook pour utiliser le worker d'analyse de données
 */
export function useDataAnalysisWorker() {
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { postMessage, isReady, error } = useWebWorker<DataAnalysisMessage, DataAnalysisResponse>(
    () => new Worker(new URL('../workers/dataAnalysis.worker.ts', import.meta.url), { type: 'module' }),
    {
      onMessage: (response) => {
        setIsAnalyzing(false);
        if (response.type === 'RESULT') {
          setResult(response.result);
        } else if (response.type === 'ERROR') {
          console.error('Worker error:', response.error);
        }
      },
      onError: (err) => {
        setIsAnalyzing(false);
        console.error('Worker error:', err);
      },
      autoTerminate: false
    }
  );

  const analyzeProjectStats = useCallback((workLogs: any[], projectId: string) => {
    if (!isReady) {
      console.warn('Worker not ready');
      return;
    }

    setIsAnalyzing(true);
    postMessage({
      type: 'ANALYZE_PROJECT_STATS',
      payload: { workLogs, projectId }
    });
  }, [isReady, postMessage]);

  const filterAndSortProjects = useCallback((
    projects: any[],
    workLogs: any[],
    filters: { searchTerm?: string; status?: string; team?: string },
    sortBy: string
  ) => {
    if (!isReady) {
      console.warn('Worker not ready');
      return;
    }

    setIsAnalyzing(true);
    postMessage({
      type: 'FILTER_AND_SORT',
      payload: { projects, workLogs, filters, sortBy }
    });
  }, [isReady, postMessage]);

  const calculateAggregates = useCallback((workLogs: any[]) => {
    if (!isReady) {
      console.warn('Worker not ready');
      return;
    }

    setIsAnalyzing(true);
    postMessage({
      type: 'CALCULATE_AGGREGATES',
      payload: { workLogs }
    });
  }, [isReady, postMessage]);

  return {
    analyzeProjectStats,
    filterAndSortProjects,
    calculateAggregates,
    result,
    isAnalyzing,
    isReady,
    error
  };
}
