
-- Créer la table client_connections pour stocker les connexions clients
CREATE TABLE public.client_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  assigned_projects text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  visibility_permissions jsonb DEFAULT '{
    "showProjectName": true,
    "showAddress": true,
    "showWorkLogs": true,
    "showTasks": true
  }'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone
);

-- Activer Row Level Security
ALTER TABLE public.client_connections ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre toutes les opérations
CREATE POLICY "Enable all operations for client_connections" 
  ON public.client_connections
  FOR ALL 
  USING (true)
  WITH CHECK (true);
