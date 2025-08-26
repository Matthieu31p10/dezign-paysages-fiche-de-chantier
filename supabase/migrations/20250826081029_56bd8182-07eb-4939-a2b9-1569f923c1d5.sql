-- Création des tables de sécurité pour le monitoring

-- Table des événements de sécurité
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  resource_accessed TEXT,
  event_details JSONB DEFAULT '{}',
  risk_score INTEGER DEFAULT 0,
  geolocation JSONB,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Table des sessions actives
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  geolocation JSONB,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_suspicious BOOLEAN DEFAULT false,
  mfa_verified BOOLEAN DEFAULT false,
  device_fingerprint TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Table des logs d'accès aux données
CREATE TABLE IF NOT EXISTS public.data_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
  record_ids TEXT[],
  query_hash TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  execution_time_ms INTEGER,
  row_count INTEGER DEFAULT 0
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour security_events (seuls les admins peuvent voir)
CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update security events" 
ON public.security_events 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Politiques RLS pour active_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.active_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
ON public.active_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "System can manage sessions" 
ON public.active_sessions 
FOR ALL 
USING (true);

-- Politiques RLS pour data_access_log (seuls les admins)
CREATE POLICY "Admins can view all access logs" 
ON public.data_access_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "System can insert access logs" 
ON public.data_access_log 
FOR INSERT 
WITH CHECK (true);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON public.security_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_activity ON public.active_sessions(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_active_sessions_suspicious ON public.active_sessions(is_suspicious);

CREATE INDEX IF NOT EXISTS idx_data_access_log_created_at ON public.data_access_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_access_log_user_id ON public.data_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_log_table_name ON public.data_access_log(table_name);

-- Fonction pour nettoyer les anciennes données
CREATE OR REPLACE FUNCTION public.cleanup_security_data()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Supprimer les événements de sécurité de plus de 90 jours
  DELETE FROM public.security_events 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Supprimer les sessions expirées
  DELETE FROM public.active_sessions 
  WHERE expires_at < NOW();
  
  -- Supprimer les logs d'accès de plus de 30 jours
  DELETE FROM public.data_access_log 
  WHERE created_at < NOW() - INTERVAL '30 days';
$$;