/**
 * Web Worker pour les calculs de temps
 * Décharge les calculs lourds du thread principal
 */

export interface TimeCalculationMessage {
  type: 'CALCULATE_TOTAL_HOURS' | 'CALCULATE_TIME_DEVIATION';
  payload: {
    departure?: string;
    arrival?: string;
    end?: string;
    breakTime?: string;
    personnelCount?: number;
    expectedDuration?: number;
  };
}

export interface TimeCalculationResponse {
  type: 'RESULT' | 'ERROR';
  result?: {
    totalHours: number;
    totalTeamHours?: number;
    deviation?: number;
    deviationClass?: 'positive' | 'negative' | 'neutral';
  };
  error?: string;
}

self.onmessage = (event: MessageEvent<TimeCalculationMessage>) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'CALCULATE_TOTAL_HOURS':
        const result = calculateTotalHours(
          payload.departure || '',
          payload.arrival || '',
          payload.end || '',
          payload.breakTime || '',
          payload.personnelCount || 1
        );
        
        self.postMessage({
          type: 'RESULT',
          result: {
            totalHours: result.totalHours,
            totalTeamHours: result.totalTeamHours
          }
        } as TimeCalculationResponse);
        break;

      case 'CALCULATE_TIME_DEVIATION':
        const deviation = calculateTimeDeviation(
          payload.departure || '',
          payload.arrival || '',
          payload.end || '',
          payload.breakTime || '',
          payload.expectedDuration || 0
        );
        
        self.postMessage({
          type: 'RESULT',
          result: deviation
        } as TimeCalculationResponse);
        break;

      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as TimeCalculationResponse);
  }
};

// Helper functions (duplicated from utils to keep worker independent)
function getMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateTotalHours(
  departure: string,
  arrival: string,
  end: string,
  breakTime: string,
  personnelCount: number
): { totalHours: number; totalTeamHours: number } {
  if (!departure || !arrival || !end) {
    return { totalHours: 0, totalTeamHours: 0 };
  }

  const departureMinutes = getMinutes(departure);
  const arrivalMinutes = getMinutes(arrival);
  const endMinutes = getMinutes(end);
  const breakMinutes = breakTime ? getMinutes(breakTime) : 0;

  let workTimeMinutes = endMinutes - arrivalMinutes;
  if (workTimeMinutes < 0) {
    workTimeMinutes += 24 * 60;
  }

  const totalTimeMinutes = workTimeMinutes - breakMinutes;
  const totalHours = Math.round((totalTimeMinutes / 60) * 100) / 100;
  const totalTeamHours = Math.round(totalHours * personnelCount * 100) / 100;

  return { totalHours, totalTeamHours };
}

function calculateTimeDeviation(
  departure: string,
  arrival: string,
  end: string,
  breakTime: string,
  expectedDuration: number
): { deviation: number; deviationClass: 'positive' | 'negative' | 'neutral'; totalHours: number } {
  const { totalHours } = calculateTotalHours(departure, arrival, end, breakTime, 1);
  
  const deviation = expectedDuration - totalHours;
  const deviationClass = deviation > 0 ? 'positive' : deviation < 0 ? 'negative' : 'neutral';

  return { deviation, deviationClass, totalHours };
}
