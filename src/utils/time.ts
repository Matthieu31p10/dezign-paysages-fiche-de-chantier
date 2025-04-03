
export const calculateTotalHours = (
  departure: string,
  arrival: string,
  end: string,
  breakTime: string,
  personnelCount: number = 1
): number => {
  if (!departure || !arrival || !end) return 0;

  try {
    // Convert times to minutes since midnight
    const getMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Calculate minutes for each component
    const departureMinutes = getMinutes(departure);
    const arrivalMinutes = getMinutes(arrival);
    const endMinutes = getMinutes(end);
    const breakMinutes = breakTime ? getMinutes(breakTime) : 0;

    // Calculate travel time
    let travelTimeMinutes = arrivalMinutes - departureMinutes;
    if (travelTimeMinutes < 0) {
      travelTimeMinutes += 24 * 60; // Handle crossing midnight
    }

    // Calculate work time
    let workTimeMinutes = endMinutes - arrivalMinutes;
    if (workTimeMinutes < 0) {
      workTimeMinutes += 24 * 60; // Handle crossing midnight
    }

    // Calculate total time
    const totalTimeMinutes = travelTimeMinutes + workTimeMinutes - breakMinutes;

    // Convert minutes to hours, multiply by personnel count, and round to 2 decimal places
    return Math.round((totalTimeMinutes / 60) * personnelCount * 100) / 100;
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
};

// Convert time string to hours
export const timeStringToHours = (timeString: string): number => {
  if (!timeString) return 0;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};
