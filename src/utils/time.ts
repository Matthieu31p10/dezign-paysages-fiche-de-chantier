
export const calculateTotalHours = (
  departure: string,
  arrival: string,
  end: string,
  breakTime: string,
  personnelCount: number = 1
): number => {
  if (!departure || !arrival || !end || !breakTime) return 0;

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
    const breakMinutes = getMinutes(breakTime);

    // Calculate total time accounting for arrival, departure, and break
    let travelTimeMinutes = arrivalMinutes - departureMinutes;
    let workTimeMinutes = endMinutes - arrivalMinutes;
    let totalTimeMinutes = travelTimeMinutes + workTimeMinutes - breakMinutes;

    // Handle cases where times span midnight
    if (arrivalMinutes < departureMinutes) {
      travelTimeMinutes = (24 * 60 - departureMinutes) + arrivalMinutes;
    }
    if (endMinutes < arrivalMinutes) {
      workTimeMinutes = (24 * 60 - arrivalMinutes) + endMinutes;
    }

    totalTimeMinutes = travelTimeMinutes + workTimeMinutes - breakMinutes;

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
