import { WorkLog } from '@/types/models';
import { toast } from 'sonner';

export const useDuplication = () => {
  const duplicateWorkLog = (originalWorkLog: WorkLog): Partial<WorkLog> => {
    const duplicated = {
      ...originalWorkLog,
      id: undefined, // Sera généré automatiquement
      date: new Date().toISOString().split('T')[0], // Date d'aujourd'hui
      timeTracking: {
        ...originalWorkLog.timeTracking,
        totalHours: 0,
        arrival: '',
        departure: '',
        breakTime: '',
        end: ''
      },
      clientSignature: null,
      invoiced: false,
      notes: originalWorkLog.notes ? `[Dupliqué] ${originalWorkLog.notes}` : '[Fiche dupliquée]',
      // Garder les consommables mais remettre les quantités à 0
      consumables: originalWorkLog.consumables?.map(c => ({
        ...c,
        quantity: 0,
        totalPrice: 0
      })) || []
    };

    toast.success('Fiche dupliquée - Vous pouvez maintenant la modifier');
    return duplicated;
  };

  const duplicateMultipleWorkLogs = (workLogs: WorkLog[]): Partial<WorkLog>[] => {
    const duplicated = workLogs.map(workLog => duplicateWorkLog(workLog));
    toast.success(`${workLogs.length} fiches dupliquées`);
    return duplicated;
  };

  const createWeeklyDuplication = (originalWorkLog: WorkLog, numberOfDays: number = 7): Partial<WorkLog>[] => {
    const duplicated: Partial<WorkLog>[] = [];
    const baseDate = new Date();

    for (let i = 1; i <= numberOfDays; i++) {
      const newDate = new Date(baseDate);
      newDate.setDate(baseDate.getDate() + i);
      
      duplicated.push({
        ...duplicateWorkLog(originalWorkLog),
        date: newDate.toISOString().split('T')[0],
        notes: `[Série hebdomadaire - Jour ${i}] ${originalWorkLog.notes || ''}`
      });
    }

    toast.success(`Série de ${numberOfDays} fiches créée pour la semaine`);
    return duplicated;
  };

  return {
    duplicateWorkLog,
    duplicateMultipleWorkLogs,
    createWeeklyDuplication
  };
};