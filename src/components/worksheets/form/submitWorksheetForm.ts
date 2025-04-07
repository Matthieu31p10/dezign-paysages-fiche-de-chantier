
import { BlankWorkSheetValues } from '../schema';
import { WorkLog } from '@/types/models';
import { toast } from 'sonner';

type SubmitHandlerParams = {
  data: BlankWorkSheetValues;
  addWorkLog: (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => void;
  onSuccess?: () => void;
  setIsSubmitting: (value: boolean) => void;
};

export const submitWorksheetForm = async ({
  data,
  addWorkLog,
  onSuccess,
  setIsSubmitting
}: SubmitHandlerParams) => {
  try {
    setIsSubmitting(true);
    
    if (!data.workDescription?.trim()) {
      toast.error("La description des travaux est obligatoire");
      setIsSubmitting(false);
      return;
    }
    
    // Ensure all consumables have required fields
    const validatedConsumables = data.consumables?.map(c => ({
      supplier: c.supplier || '',
      product: c.product || '',
      unit: c.unit || '',
      quantity: Number(c.quantity) || 0,
      unitPrice: Number(c.unitPrice) || 0,
      totalPrice: Number(c.totalPrice) || 0
    })) || [];
    
    const workLogData: Omit<WorkLog, 'id' | 'createdAt'> = {
      projectId: 'blank-' + Date.now().toString(),
      date: data.date,
      duration: data.totalHours,
      personnel: data.personnel,
      timeTracking: {
        departure: data.departure,
        arrival: data.arrival,
        end: data.end,
        breakTime: data.breakTime,
        totalHours: data.totalHours
      },
      tasksPerformed: {
        mowing: false,
        brushcutting: false,
        blower: false,
        manualWeeding: false,
        whiteVinegar: false,
        pruning: {
          done: false,
          progress: 0
        },
        watering: 'none',
        customTasks: {},
        tasksProgress: {}
      },
      notes: data.workDescription,
      wasteManagement: data.wasteManagement,
      consumables: validatedConsumables
    };
    
    addWorkLog(workLogData);
    
    toast.success("Fiche vierge créée avec succès");
    
    if (onSuccess) {
      onSuccess();
    }
    
  } catch (error) {
    console.error('Erreur lors de la création de la fiche:', error);
    toast.error("Erreur lors de la création de la fiche");
  } finally {
    setIsSubmitting(false);
  }
};
