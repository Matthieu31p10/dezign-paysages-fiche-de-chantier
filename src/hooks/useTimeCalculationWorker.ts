import { useCallback, useState } from 'react';
import { useWebWorker } from './useWebWorker';
import type { TimeCalculationMessage, TimeCalculationResponse } from '@/workers/timeCalculations.worker';

/**
 * Hook pour utiliser le worker de calculs de temps
 */
export function useTimeCalculationWorker() {
  const [result, setResult] = useState<TimeCalculationResponse['result'] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { postMessage, isReady, error } = useWebWorker<TimeCalculationMessage, TimeCalculationResponse>(
    () => new Worker(new URL('../workers/timeCalculations.worker.ts', import.meta.url), { type: 'module' }),
    {
      onMessage: (response) => {
        setIsCalculating(false);
        if (response.type === 'RESULT') {
          setResult(response.result || null);
        } else if (response.type === 'ERROR') {
          console.error('Worker error:', response.error);
        }
      },
      onError: (err) => {
        setIsCalculating(false);
        console.error('Worker error:', err);
      },
      autoTerminate: false
    }
  );

  const calculateTotalHours = useCallback((
    departure: string,
    arrival: string,
    end: string,
    breakTime: string,
    personnelCount: number = 1
  ) => {
    if (!isReady) {
      console.warn('Worker not ready');
      return;
    }

    setIsCalculating(true);
    postMessage({
      type: 'CALCULATE_TOTAL_HOURS',
      payload: { departure, arrival, end, breakTime, personnelCount }
    });
  }, [isReady, postMessage]);

  const calculateTimeDeviation = useCallback((
    departure: string,
    arrival: string,
    end: string,
    breakTime: string,
    expectedDuration: number
  ) => {
    if (!isReady) {
      console.warn('Worker not ready');
      return;
    }

    setIsCalculating(true);
    postMessage({
      type: 'CALCULATE_TIME_DEVIATION',
      payload: { departure, arrival, end, breakTime, expectedDuration }
    });
  }, [isReady, postMessage]);

  return {
    calculateTotalHours,
    calculateTimeDeviation,
    result,
    isCalculating,
    isReady,
    error
  };
}
