
import { ProjectInfo } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatProjectForDatabase } from '@/context/projects/storage/projectOperations';
import { handleDatabaseError } from '@/utils/error';

export const saveProjectToSupabase = async (project: ProjectInfo) => {
  try {
    // Use the formatter from projectOperations to get the correct format for Supabase
    const projectData = formatProjectForDatabase(project);
    
    const { error } = await supabase
      .from('projects')
      .upsert(projectData, { onConflict: 'id' });
    
    if (error) {
      handleDatabaseError(error, 'saveProject', { projectName: project.name });
      throw error;
    }
    
    // Project saved successfully
  } catch (error) {
    handleDatabaseError(error, 'saveProjectToSupabase');
    toast.error("Erreur lors de l'enregistrement du projet dans Supabase");
    throw error;
  }
};
