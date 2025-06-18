
export const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' },
];

export const getDayLabel = (dayOfWeek: number) => {
  const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
  return day ? day.label : 'Jour inconnu';
};

export const getDayShort = (dayOfWeek: number) => {
  const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
  return day ? day.short : '?';
};
