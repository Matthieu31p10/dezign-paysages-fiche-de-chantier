import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ClientConnection = {
  id: string;
  client_name: string;
  email: string;
  password: string;
  assigned_projects: string[];
  visibility_permissions: any; // Using any to handle Supabase Json type
  is_active: boolean;
  last_login?: string;
  created_at?: string;
};

export type ClientSession = {
  client: ClientConnection;
  sessionExpiry: string;
  assignedProjects: string[];
};

export const useClientAuth = () => {
  const [currentClient, setCurrentClient] = useState<ClientConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkClientSession();
  }, []);

  const checkClientSession = () => {
    const sessionData = localStorage.getItem('clientSession');
    if (sessionData) {
      try {
        const session: ClientSession = JSON.parse(sessionData);
        
        // Vérifier l'expiration de la session
        if (new Date() > new Date(session.sessionExpiry)) {
          localStorage.removeItem('clientSession');
          setCurrentClient(null);
          toast.error('Session expirée, veuillez vous reconnecter');
        } else {
          setCurrentClient(session.client);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        localStorage.removeItem('clientSession');
        setCurrentClient(null);
      }
    }
    setLoading(false);
  };

  const loginClient = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      // Rechercher le client dans Supabase
      const { data: client, error } = await supabase
        .from('client_connections')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Note: En production, utiliser un hash sécurisé
        .eq('is_active', true)
        .single();

      if (error || !client) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Mettre à jour la dernière connexion
      await supabase
        .from('client_connections')
        .update({ last_login: new Date().toISOString() })
        .eq('id', client.id);

      // Créer une session (expire dans 24 heures)
      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 24);

      const clientSession: ClientSession = {
        client,
        sessionExpiry: sessionExpiry.toISOString(),
        assignedProjects: client.assigned_projects || []
      };

      localStorage.setItem('clientSession', JSON.stringify(clientSession));
      setCurrentClient(client);
      
      toast.success(`Bienvenue ${client.client_name}`);
      return { success: true };

    } catch (error) {
      console.error('Erreur lors de la connexion client:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    } finally {
      setLoading(false);
    }
  };

  const logoutClient = () => {
    localStorage.removeItem('clientSession');
    setCurrentClient(null);
    toast.success('Déconnexion réussie');
  };

  const getClientProjects = async () => {
    if (!currentClient || !currentClient.assigned_projects?.length) {
      return [];
    }

    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', currentClient.assigned_projects)
        .eq('is_archived', false);

      if (error) throw error;
      return projects || [];
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Erreur lors du chargement des projets');
      return [];
    }
  };

  const getClientWorkLogs = async (projectIds?: string[]) => {
    const idsToUse = projectIds || currentClient?.assigned_projects || [];
    
    if (!idsToUse.length) {
      return [];
    }

    try {
      const { data: workLogs, error } = await supabase
        .from('work_logs')
        .select(`
          *,
          project:projects(name, address)
        `)
        .in('project_id', idsToUse)
        .eq('is_archived', false)
        .order('date', { ascending: false });

      if (error) throw error;
      return workLogs || [];
    } catch (error) {
      console.error('Erreur lors du chargement des fiches de travail:', error);
      toast.error('Erreur lors du chargement des fiches de travail');
      return [];
    }
  };

  const canViewField = (field: keyof ClientConnection['visibility_permissions']): boolean => {
    return currentClient?.visibility_permissions?.[field] ?? true;
  };

  return {
    currentClient,
    loading,
    loginClient,
    logoutClient,
    getClientProjects,
    getClientWorkLogs,
    canViewField,
    isAuthenticated: !!currentClient
  };
};