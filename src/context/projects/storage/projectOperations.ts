
import { ProjectInfo } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';

export const formatProjectForDatabase = (project: ProjectInfo) => {
  return {
    id: project.id,
    name: project.name,
    client_name: project.contact?.name || '',
    address: project.address,
    contact_phone: project.contact?.phone || '',
    contact_email: project.contact?.email || '',
    contact_name: project.contact?.name || '',
    contract_details: project.contract?.details || '',
    contract_document_url: project.contract?.documentUrl || '',
    irrigation: project.irrigation,
    mower_type: project.mowerType,
    annual_visits: project.annualVisits || 0,
    annual_total_hours: project.annualTotalHours || 0,
    visit_duration: project.visitDuration || 0,
    additional_info: project.additionalInfo || '',
    project_type: project.projectType || '',
    start_date: project.startDate ? new Date(project.startDate).toISOString() : null,
    end_date: project.endDate ? new Date(project.endDate).toISOString() : null,
    is_archived: project.isArchived || false,
    created_at: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString()
  };
};

export const formatProjectFromDatabase = (dbProject: any): ProjectInfo => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    clientName: dbProject.client_name,
    address: dbProject.address,
    contactPhone: dbProject.contact_phone,
    contactEmail: dbProject.contact_email,
    contact: {
      name: dbProject.contact_name || '',
      phone: dbProject.contact_phone || '',
      email: dbProject.contact_email || '',
    },
    contract: {
      details: dbProject.contract_details || '',
      documentUrl: dbProject.contract_document_url || '',
    },
    irrigation: dbProject.irrigation,
    mowerType: dbProject.mower_type,
    annualVisits: dbProject.annual_visits || 0,
    annualTotalHours: dbProject.annual_total_hours || 0,
    visitDuration: dbProject.visit_duration || 0,
    additionalInfo: dbProject.additional_info || '',
    teams: [], // Sera chargé séparément via la table project_teams
    team: '', // Sera défini à partir de l'équipe primaire
    projectType: dbProject.project_type || '',
    startDate: dbProject.start_date ? new Date(dbProject.start_date) : null,
    endDate: dbProject.end_date ? new Date(dbProject.end_date) : null,
    isArchived: dbProject.is_archived || false,
    createdAt: new Date(dbProject.created_at || Date.now()),
    documents: [] // Sera chargé séparément si nécessaire
  };
};

export const saveProject = async (project: ProjectInfo): Promise<void> => {
  const formattedProject = formatProjectForDatabase(project);
  
  const { error } = await supabase
    .from('projects')
    .upsert(formattedProject, { onConflict: 'id' });
  
  if (error) {
    console.error('Error saving project:', error);
    throw new Error(`Failed to save project: ${error.message}`);
  }
};

export const loadProjects = async (): Promise<ProjectInfo[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading projects:', error);
    throw new Error(`Failed to load projects: ${error.message}`);
  }
  
  return data?.map(formatProjectFromDatabase) || [];
};
