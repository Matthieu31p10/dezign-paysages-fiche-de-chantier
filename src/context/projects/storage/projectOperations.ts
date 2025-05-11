
import { ProjectInfo } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Formats a project from the database format to the app format
 */
export const formatProjectFromDatabase = (project: any): ProjectInfo => {
  return {
    id: project.id,
    name: project.name,
    clientName: project.client_name || project.name,
    address: project.address,
    contact: {
      name: project.contact_name || '',
      phone: project.contact_phone || '',
      email: project.contact_email || '',
    },
    contract: {
      details: project.contract_details || '',
      documentUrl: project.contract_document_url || '',
    },
    irrigation: project.irrigation || 'none',
    mowerType: project.mower_type || 'both',
    annualVisits: project.annual_visits || 0,
    annualTotalHours: project.annual_total_hours || 0,
    visitDuration: project.visit_duration || 0,
    additionalInfo: project.additional_info || '',
    team: project.team_id || '',
    projectType: project.project_type || '',
    startDate: project.start_date ? new Date(project.start_date) : null,
    endDate: project.end_date ? new Date(project.end_date) : null,
    isArchived: project.is_archived || false,
    createdAt: project.created_at ? new Date(project.created_at) : new Date(),
  };
};

/**
 * Formats a project from the app format to the database format
 */
export const formatProjectForDatabase = (project: ProjectInfo): any => {
  // Convert Date objects to ISO strings for Supabase compatibility
  const startDate = project.startDate instanceof Date ? project.startDate.toISOString() : project.startDate;
  const endDate = project.endDate instanceof Date ? project.endDate.toISOString() : project.endDate;
  const createdAt = project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt;
  
  return {
    id: project.id,
    name: project.name,
    client_name: project.clientName || project.name,
    address: project.address,
    contact_name: project.contact?.name,
    contact_phone: project.contact?.phone,
    contact_email: project.contact?.email,
    contract_details: project.contract?.details,
    contract_document_url: project.contract?.documentUrl,
    irrigation: project.irrigation,
    mower_type: project.mowerType,
    annual_visits: project.annualVisits,
    annual_total_hours: project.annualTotalHours,
    visit_duration: project.visitDuration,
    additional_info: project.additionalInfo,
    team_id: project.team,
    project_type: project.projectType,
    start_date: startDate,
    end_date: endDate,
    is_archived: project.isArchived,
    created_at: createdAt,
  };
};

/**
 * Load projects from database
 */
export const loadProjectsFromStorage = async (): Promise<ProjectInfo[]> => {
  try {
    console.log("Loading projects from Supabase");
    
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Map the projects to their app format
    const projects: ProjectInfo[] = data.map(project => 
      formatProjectFromDatabase(project)
    );
    
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    toast.error('Erreur lors du chargement des projets');
    return [];
  }
};

/**
 * Save projects to database
 */
export const saveProjectsToStorage = async (projects: ProjectInfo[]): Promise<void> => {
  try {
    console.log("Saving projects to Supabase:", projects);
    
    // For each project, upsert to database
    for (const project of projects) {
      // Prepare project data for database
      const projectData = formatProjectForDatabase(project);
      
      const { error } = await supabase
        .from('projects')
        .upsert(projectData, { onConflict: 'id' });
      
      if (error) {
        throw error;
      }
    }
    
    toast.success('Projets sauvegardés avec succès');
  } catch (error) {
    console.error('Error saving projects:', error);
    toast.error('Erreur lors de l\'enregistrement des projets');
    throw error;
  }
};

/**
 * Delete a project from the database
 */
export const deleteProjectFromStorage = async (projectId: string): Promise<void> => {
  try {
    console.log("Deleting project from Supabase:", projectId);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      throw error;
    }
    
  } catch (error) {
    console.error('Error deleting project:', error);
    toast.error('Erreur lors de la suppression du projet');
    throw error;
  }
};
