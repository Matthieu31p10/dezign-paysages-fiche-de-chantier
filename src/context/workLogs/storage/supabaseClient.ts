
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Error handler for Supabase operations
 */
export const handleSupabaseError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  
  // Enhanced error messaging
  if (error?.message) {
    toast.error(`${message}: ${error.message}`);
  } else {
    toast.error(message);
  }
  
  throw error;
};

/**
 * Execute a Supabase query with error handling
 * Generic type T is the expected return type of the data
 */
export const executeSupabaseQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  errorMessage: string
): Promise<T> => {
  try {
    console.log(`Executing Supabase query: ${errorMessage}`);
    
    const response = await queryFn();
    
    // Extract data and error from the response
    const { data, error } = response;
    
    if (error) {
      console.error(`Supabase error in ${errorMessage}:`, error);
      handleSupabaseError(error, errorMessage);
    }
    
    console.log(`Supabase query successful: ${errorMessage}`);
    return data as T;
  } catch (error) {
    console.error(`Exception in executeSupabaseQuery for ${errorMessage}:`, error);
    handleSupabaseError(error, errorMessage);
    throw error;
  }
};

/**
 * Safe execution of Supabase operations with retry logic
 */
export const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 2,
  errorMessage: string = "Opération Supabase"
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        console.warn(`Tentative ${attempt + 1} échouée pour ${errorMessage}, nouvelle tentative...`);
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  handleSupabaseError(lastError, `${errorMessage} (après ${retries + 1} tentatives)`);
  throw lastError;
};
