
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlankWorksheet } from '@/types/blankWorksheet';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useBlankWorksheetCRUD } from './hooks/useBlankWorksheetCRUD';
import { useBlankWorksheetQueries } from './hooks/useBlankWorksheetQueries';

interface BlankWorksheetsContextType {
  blankWorksheets: BlankWorksheet[];
  isLoading: boolean;
  addBlankWorksheet: (worksheet: BlankWorksheet) => Promise<BlankWorksheet>;
  updateBlankWorksheet: (worksheet: BlankWorksheet) => Promise<void>;
  deleteBlankWorksheet: (id: string) => Promise<void>;
  getBlankWorksheetById: (id: string) => BlankWorksheet | undefined;
}

const BlankWorksheetsContext = createContext<BlankWorksheetsContextType | undefined>(undefined);

export const BlankWorksheetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blankWorksheets, setBlankWorksheets] = useState<BlankWorksheet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const crudOperations = useBlankWorksheetCRUD(blankWorksheets, setBlankWorksheets);
  const queryOperations = useBlankWorksheetQueries(blankWorksheets);

  // Load blank worksheets from Supabase on mount
  useEffect(() => {
    const fetchBlankWorksheets = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blank_worksheets')
          .select(`
            *,
            blank_worksheet_consumables (*)
          `)
          .order('date', { ascending: false });

        if (error) throw error;

        const formattedWorksheets: BlankWorksheet[] = data.map(worksheet => ({
          id: worksheet.id,
          date: worksheet.date,
          personnel: worksheet.personnel || [],
          departure: worksheet.departure,
          arrival: worksheet.arrival,
          end_time: worksheet.end_time,
          break_time: worksheet.break_time,
          total_hours: Number(worksheet.total_hours || 0),
          water_consumption: Number(worksheet.water_consumption || 0),
          waste_management: worksheet.waste_management || 'none',
          tasks: worksheet.tasks,
          notes: worksheet.notes,
          invoiced: Boolean(worksheet.invoiced),
          is_archived: Boolean(worksheet.is_archived),
          client_signature: worksheet.client_signature,
          client_name: worksheet.client_name,
          address: worksheet.address,
          contact_phone: worksheet.contact_phone,
          contact_email: worksheet.contact_email,
          hourly_rate: worksheet.hourly_rate ? Number(worksheet.hourly_rate) : undefined,
          linked_project_id: worksheet.linked_project_id,
          signed_quote_amount: worksheet.signed_quote_amount ? Number(worksheet.signed_quote_amount) : undefined,
          is_quote_signed: Boolean(worksheet.is_quote_signed),
          created_at: new Date(worksheet.created_at),
          created_by: worksheet.created_by,
          consumables: worksheet.blank_worksheet_consumables?.map(c => ({
            id: c.id,
            blank_worksheet_id: c.blank_worksheet_id,
            supplier: c.supplier,
            product: c.product,
            unit: c.unit,
            quantity: Number(c.quantity),
            unit_price: Number(c.unit_price),
            total_price: Number(c.total_price),
            saved_for_reuse: Boolean(c.saved_for_reuse)
          })) || []
        }));

        setBlankWorksheets(formattedWorksheets);
      } catch (error) {
        console.error("Error loading blank worksheets:", error);
        toast.error("Erreur lors du chargement des fiches vierges");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlankWorksheets();
  }, []);

  return (
    <BlankWorksheetsContext.Provider
      value={{
        blankWorksheets,
        isLoading,
        ...crudOperations,
        ...queryOperations,
      }}
    >
      {children}
    </BlankWorksheetsContext.Provider>
  );
};

export const useBlankWorksheets = () => {
  const context = useContext(BlankWorksheetsContext);
  if (context === undefined) {
    throw new Error('useBlankWorksheets must be used within a BlankWorksheetsProvider');
  }
  return context;
};
