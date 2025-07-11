
import { supabase } from '@/integrations/supabase/client';
import { ClientConnection, ClientVisibilityPermissions } from '@/types/models';

export const clientConnectionsService = {
  async getAll(): Promise<ClientConnection[]> {
    const { data, error } = await supabase
      .from('client_connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client connections:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      clientName: item.client_name,
      email: item.email,
      password: item.password,
      assignedProjects: item.assigned_projects || [],
      isActive: item.is_active,
      visibilityPermissions: (item.visibility_permissions as ClientVisibilityPermissions) || {
        showProjectName: true,
        showAddress: true,
        showWorkLogs: true,
        showTasks: true
      },
      createdAt: new Date(item.created_at),
      lastLogin: item.last_login ? new Date(item.last_login) : undefined
    }));
  },

  async create(clientData: Omit<ClientConnection, 'id' | 'createdAt'>): Promise<ClientConnection> {
    const { data, error } = await supabase
      .from('client_connections')
      .insert({
        client_name: clientData.clientName,
        email: clientData.email,
        password: clientData.password,
        assigned_projects: clientData.assignedProjects,
        is_active: clientData.isActive,
        visibility_permissions: (clientData.visibilityPermissions || {
          showProjectName: true,
          showAddress: true,
          showWorkLogs: true,
          showTasks: true
        }) as any
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client connection:', error);
      throw error;
    }

    return {
      id: data.id,
      clientName: data.client_name,
      email: data.email,
      password: data.password,
      assignedProjects: data.assigned_projects || [],
      isActive: data.is_active,
      visibilityPermissions: (data.visibility_permissions as ClientVisibilityPermissions) || {
        showProjectName: true,
        showAddress: true,
        showWorkLogs: true,
        showTasks: true
      },
      createdAt: new Date(data.created_at),
      lastLogin: data.last_login ? new Date(data.last_login) : undefined
    };
  },

  async update(id: string, clientData: Partial<ClientConnection>): Promise<void> {
    const updateData: any = {};
    
    if (clientData.clientName !== undefined) updateData.client_name = clientData.clientName;
    if (clientData.email !== undefined) updateData.email = clientData.email;
    if (clientData.password !== undefined) updateData.password = clientData.password;
    if (clientData.assignedProjects !== undefined) updateData.assigned_projects = clientData.assignedProjects;
    if (clientData.isActive !== undefined) updateData.is_active = clientData.isActive;
    if (clientData.visibilityPermissions !== undefined) updateData.visibility_permissions = clientData.visibilityPermissions as any;
    if (clientData.lastLogin !== undefined) updateData.last_login = clientData.lastLogin;

    const { error } = await supabase
      .from('client_connections')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating client connection:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('client_connections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client connection:', error);
      throw error;
    }
  },

  async findByEmailAndPassword(email: string, password: string): Promise<ClientConnection | null> {
    const { data, error } = await supabase
      .from('client_connections')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error finding client by credentials:', error);
      throw error;
    }

    return {
      id: data.id,
      clientName: data.client_name,
      email: data.email,
      password: data.password,
      assignedProjects: data.assigned_projects || [],
      isActive: data.is_active,
      visibilityPermissions: (data.visibility_permissions as ClientVisibilityPermissions) || {
        showProjectName: true,
        showAddress: true,
        showWorkLogs: true,
        showTasks: true
      },
      createdAt: new Date(data.created_at),
      lastLogin: data.last_login ? new Date(data.last_login) : undefined
    };
  }
};
