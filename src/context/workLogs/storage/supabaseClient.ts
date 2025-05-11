
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  queryFn: () => Promise<{ data: T; error: any }> | any,
  errorMessage: string
): Promise<T> => {
  try {
    // Make sure the query is executed as a promise
    const response = await queryFn();
    
    // Extract data and error from the response
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
