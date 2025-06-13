
import { ProjectInfo } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Format project data for Supabase storage
export const formatProjectForDatabase = (project: ProjectInfo) => {
  return {
    id: project.id,
    name: project.name,
    client_name: project.clientName || null,
    address: project.address,
    contact_phone: project.contactPhone || null,
    contact_email: project.contactEmail || null,
    contact_name: project.contact?.name || null,
    contract_details: project.contract?.details || null,
    contract_document_url: project.contract?.documentUrl || null,
    irrigation: project.irrigation || null,
    mower_type: project.mowerType || null,
    annual_visits: project.annualVisits || 0,
    annual_total_hours: project.annualTotalHours || 0,
    visit_duration: project.visitDuration || 0,
    additional_info: project.additionalInfo || null,
    team_id: project.team || null, // Maintenant team est une string qui correspond à team_id
    project_type: project.projectType || null,
    start_date: project.startDate ? project.startDate.toISOString() : null,
    end_date: project.endDate ? project.endDate.toISOString() : null,
    is_archived: project.isArchived || false,
    created_at: project.createdAt ? project.createdAt.toISOString() : new Date().toISOString()
  };
};

// Format project data from Supabase storage
export const formatProjectFromDatabase = (dbProject: any): ProjectInfo => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    clientName: dbProject.client_name,
    address: dbProject.address,
    contactPhone: dbProject.contact_phone,
    contactEmail: dbProject.contact_email,
    contact: {
      name: dbProject.contact_name,
      phone: dbProject.contact_phone || '',
      email: dbProject.contact_email || ''
    },
    contract: {
      details: dbProject.contract_details || '',
      documentUrl: dbProject.contract_document_url
    },
    irrigation: dbProject.irrigation,
    mowerType: dbProject.mower_type,
    annualVisits: dbProject.annual_visits || 0,
    annualTotalHours: dbProject.annual_total_hours || 0,
    visitDuration: dbProject.visit_duration || 0,
    additionalInfo: dbProject.additional_info || '',
    team: dbProject.team_id || '', // team_id mappé vers team
    projectType: dbProject.project_type || '',
    startDate: dbProject.start_date ? new Date(dbProject.start_date) : null,
    endDate: dbProject.end_date ? new Date(dbProject.end_date) : null,
    isArchived: dbProject.is_archived || false,
    createdAt: dbProject.created_at ? new Date(dbProject.created_at) : new Date(),
    documents: []
  };
};

export const loadProjectsFromStorage = async (): Promise<ProjectInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading projects from Supabase:", error);
      throw error;
    }

    return data ? data.map(formatProjectFromDatabase) : [];
  } catch (error) {
    console.error("Error in loadProjectsFromStorage:", error);
    toast.error("Erreur lors du chargement des projets");
    throw error;
  }
};

export const saveProjectsToStorage = async (projects: ProjectInfo[]): Promise<void> => {
  try {
    const formattedProjects = projects.map(formatProjectForDatabase);
    
    const { error } = await supabase
      .from('projects')
      .upsert(formattedProjects, { onConflict: 'id' });

    if (error) {
      console.error("Error saving projects to Supabase:", error);
      throw error;
    }

    console.log("Projects saved successfully to Supabase");
  } catch (error) {
    console.error("Error in saveProjectsToStorage:", error);
    toast.error("Erreur lors de l'enregistrement des projets");
    throw error;
  }
};

export const deleteProjectFromStorage = async (projectId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error("Error deleting project from Supabase:", error);
      throw error;
    }

    console.log("Project deleted successfully from Supabase");
  } catch (error) {
    console.error("Error in deleteProjectFromStorage:", error);
    toast.error("Erreur lors de la suppression du projet");
    throw error;
  }
};
