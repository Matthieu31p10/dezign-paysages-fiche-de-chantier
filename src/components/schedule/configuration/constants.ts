
import { DayOption, TimeSlot } from './types';

export const daysOfWeek: DayOption[] = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
];

export const timeSlots: TimeSlot[] = [
  { value: 'morning', label: 'Matin (8h-12h)' },
  { value: 'afternoon', label: 'Après-midi (13h-17h)' },
  { value: 'evening', label: 'Soirée (17h-19h)' }
];

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700 border-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'low': return 'bg-green-100 text-green-700 border-green-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};
