
export interface ProjectDayLock {
  id: string;
  projectId: string;
  dayOfWeek: number; // 1 = Lundi, 2 = Mardi, ..., 7 = Dimanche
  reason: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  minDaysBetweenVisits?: number; // Nouveau champ pour le délai minimum
}

export interface ProjectLockFormData {
  projectId: string;
  dayOfWeek: number;
  reason: string;
  description: string;
  minDaysBetweenVisits?: number; // Nouveau champ pour le délai minimum
}
