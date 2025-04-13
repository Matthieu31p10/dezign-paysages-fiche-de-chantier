
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues, BlankWorkSheetSchema } from '../../schema';
import { WorkLog } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface UseFormInitializationProps {
  initialData?: WorkLog;
}

/**
 * Custom hook to initialize form with default values and validation
 */
export const useFormInitialization = ({ 
  initialData 
}: UseFormInitializationProps): UseFormReturn<BlankWorkSheetValues> => {
  return useForm<BlankWorkSheetValues>({
    resolver: zodResolver(BlankWorkSheetSchema),
    defaultValues: {
      clientName: initialData?.clientName || '',
      address: initialData?.address || '',
      contactPhone: initialData?.contactPhone || '',
      contactEmail: initialData?.contactEmail || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      personnel: initialData?.personnel || [],
      departure: initialData?.timeTracking?.departure || '',
      arrival: initialData?.timeTracking?.arrival || '',
      end: initialData?.timeTracking?.end || '',
      breakTime: initialData?.timeTracking?.breakTime || '',
      tasks: initialData?.tasks || '',
      wasteManagement: initialData?.wasteManagement || 'none',
      notes: initialData?.notes || '',
      clientSignature: initialData?.clientSignature || null,
      consumables: initialData?.consumables || [],
      totalHours: initialData?.timeTracking?.totalHours || 0,
      hourlyRate: initialData?.hourlyRate || 0,
      signedQuoteAmount: initialData?.signedQuoteAmount || 0,
      isQuoteSigned: initialData?.isQuoteSigned || false,
      linkedProjectId: initialData?.linkedProjectId || null,
      teamFilter: 'all'
    }
  });
};
