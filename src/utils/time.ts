
/**
 * Calculate total hours worked based on departure, arrival, end and break times
 * @param departure Start time from the office (e.g. "08:00")
 * @param arrival Arrival time at the work site (e.g. "08:30")
 * @param end End time when work is completed (e.g. "16:30")
 * @param breakTime Duration of breaks (e.g. "00:30")
 * @param personnel Number of personnel involved (for total team hours)
 * @returns Total hours worked (as a decimal)
 */
export const calculateTotalHours = (
  departure: string,
  arrival: string,
  end: string,
  breakTime: string,
  personnel: number = 1
): number => {
  try {
    if (!departure || !arrival || !end) {
      return 0;
    }

    // Parse times to minutes from midnight
    const departureMinutes = parseTimeToMinutes(departure);
    const arrivalMinutes = parseTimeToMinutes(arrival);
    const endMinutes = parseTimeToMinutes(end);
    const breakMinutes = parseTimeToMinutes(breakTime || '00:00');

    // Calculate travel time (one-way)
    const travelTime = arrivalMinutes - departureMinutes;

    // Calculate time at site (including breaks)
    const siteTime = endMinutes - arrivalMinutes;

    // Calculate working time (excluding breaks)
    const workingTime = siteTime - breakMinutes;

    // Convert minutes to hours with 2 decimal places
    const totalHours = parseFloat((workingTime / 60).toFixed(2));

    return totalHours > 0 ? totalHours : 0;
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
};

/**
 * Parse a time string (HH:MM) to minutes since midnight
 * @param timeStr Time string in 24-hour format (e.g. "08:30")
 * @returns Minutes since midnight
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
};

/**
 * Format minutes since midnight to a time string (HH:MM)
 * @param minutes Minutes since midnight
 * @returns Time string in 24-hour format (e.g. "08:30")
 */
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Format a decimal hours value to hours and minutes string (e.g. "7h30")
 * @param hours Decimal hours (e.g. 7.5)
 * @returns Formatted string (e.g. "7h30")
 */
export const formatHoursToString = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  return `${hrs}h${mins.toString().padStart(2, '0')}`;
};
