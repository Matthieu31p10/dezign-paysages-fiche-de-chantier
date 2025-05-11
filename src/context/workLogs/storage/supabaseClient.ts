
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/supabase-js';

/**
 * Error handler for Supabase operations
 */
export const handleSupabaseError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  toast.error(message);
  throw error;
};

/**
 * Execute a Supabase query with error handling
 * Generic type T is the expected return type of the data
 */
export const executeSupabaseQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }> | PostgrestFilterBuilder<any> | PostgrestQueryBuilder<any>,
  errorMessage: string
): Promise<T> => {
  try {
    // Assurez-vous que la requête est bien une promesse
    const response = await queryFn();
    
    // Extraire les données et l'erreur de la réponse
    const { data, error } = response as { data: T; error: any };
    
    if (error) {
      handleSupabaseError(error, errorMessage);
    }
    
    return data as T;
  } catch (error) {
    handleSupabaseError(error, errorMessage);
    throw error; // This ensures the promise is rejected
  }
};
