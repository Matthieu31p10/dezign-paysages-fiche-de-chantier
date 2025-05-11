
import { ProjectInfo } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatProjectForDatabase } from '@/context/projects/storage/projectOperations';

export const saveProjectToSupabase = async (project: ProjectInfo) => {
  try {
    // Use the formatter from projectOperations to get the correct format for Supabase
    const projectData = formatProjectForDatabase(project);
    
    const { error } = await supabase
      .from('projects')
      .upsert(projectData, { onConflict: 'id' });
    
    if (error) {
      console.error("Error saving project to Supabase:", error);
      throw error;
    }
    
    console.log("Project saved successfully to Supabase");
  } catch (error) {
    console.error("Error in saveProjectToSupabase:", error);
    toast.error("Erreur lors de l'enregistrement du projet dans Supabase");
    throw error;
  }
};
