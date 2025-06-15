
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBlankWorksheets } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import { BlankWorksheet } from '@/types/blankWorksheet';
import { validateConsumables, formatStructuredNotes } from '../utils/formatWorksheetData';
import { useApp } from '@/context/AppContext';

interface UseFormActionsProps {
  onSuccess?: () => void;
  isEditing?: boolean;
}

export const useFormActions = ({ onSuccess, isEditing }: UseFormActionsProps) => {
  const navigate = useNavigate();
  const { addBlankWorksheet, updateBlankWorksheet } = useBlankWorksheets();
  const { getCurrentUser } = useApp();

  const handleCancel = useCallback(() => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/blank-worksheets');
    }
  }, [navigate, onSuccess]);

  const handleSubmit = useCallback(async (data: any, worksheetId?: string) => {
    try {
      console.log('Submitting blank worksheet:', data);
      
      // Format structured notes
      const structuredNotes = formatStructuredNotes(data);
      
      // Validate consumables
      const validatedConsumables = validateConsumables(data.consumables || []);
      
      // Calculate total hours if not provided
      let totalHours = data.totalHours || 0;
      if (data.departure && data.arrival && data.end) {
        const departure = new Date(`1970-01-01T${data.departure}:00`);
        const arrival = new Date(`1970-01-01T${data.arrival}:00`);
        const end = new Date(`1970-01-01T${data.end}:00`);
        const breakTime = data.breakTime ? parseFloat(data.breakTime) : 0;
        
        const workTimeMs = end.getTime() - arrival.getTime();
        const workTimeHours = workTimeMs / (1000 * 60 * 60);
        totalHours = Math.max(0, workTimeHours - breakTime);
      }

      // Get current user
      const currentUser = getCurrentUser();
      
      // Create blank worksheet object
      const worksheetData: BlankWorksheet = {
        id: worksheetId || crypto.randomUUID(),
        date: data.date.toISOString().split('T')[0],
        personnel: data.personnel || [],
        departure: data.departure,
        arrival: data.arrival,
        end_time: data.end,
        break_time: data.breakTime,
        total_hours: totalHours,
        water_consumption: data.waterConsumption,
        waste_management: data.wasteManagement || 'none',
        tasks: data.tasks,
        notes: structuredNotes,
        consumables: validatedConsumables,
        invoiced: data.invoiced || false,
        is_archived: false,
        client_name: data.clientName,
        address: data.address,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail,
        hourly_rate: data.hourlyRate,
        signed_quote_amount: data.signedQuoteAmount,
        is_quote_signed: data.isQuoteSigned,
        linked_project_id: data.linkedProjectId,
        created_at: new Date(),
        created_by: currentUser?.name
      };

      console.log('Final worksheet data:', worksheetData);
      
      if (isEditing && worksheetId) {
        await updateBlankWorksheet(worksheetData);
        toast.success('Fiche vierge modifiée avec succès');
      } else {
        await addBlankWorksheet(worksheetData);
        toast.success('Fiche vierge créée avec succès');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/blank-worksheets');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la fiche');
    }
  }, [addBlankWorksheet, updateBlankWorksheet, navigate, onSuccess, isEditing, getCurrentUser]);

  return {
    handleCancel,
    handleSubmit
  };
};
