
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlankWorkSheetSchema, BlankWorkSheetValues } from '../../schema';

/**
 * Hook to initialize the blank worksheet form with default values
 */
export const useFormInitialization = () => {
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(BlankWorkSheetSchema),
    defaultValues: {
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      notes: '',
      tasks: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
      quoteValue: 0,
      clientSignature: '',
    }
  });
  
  return form;
};
