-- ÉTAPE 3: AUDIT & MONITORING - Tables de surveillance sécurisée

-- Table des événements de sécurité
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'login_attempt', 'mfa_challenge', 'password_change', 'suspicious_activity', 'data_access'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  resource_accessed TEXT, -- Table/endpoint accédé
  event_details JSONB NOT NULL DEFAULT '{}',
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  geolocation JSONB, -- Pays, ville si disponible
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Index pour optimiser les requêtes de monitoring
CREATE INDEX idx_security_events_type_severity ON public.security_events(event_type, severity);
CREATE INDEX idx_security_events_user_created ON public.security_events(user_id, created_at);
CREATE INDEX idx_security_events_ip_created ON public.security_events(ip_address, created_at);
CREATE INDEX idx_security_events_risk_score ON public.security_events(risk_score DESC);

-- Table pour les sessions actives et leur monitoring
CREATE TABLE public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL, -- Hash du token pour identification
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

-- Index pour monitoring des sessions
CREATE INDEX idx_active_sessions_user_activity ON public.active_sessions(user_id, last_activity);
CREATE INDEX idx_active_sessions_suspicious ON public.active_sessions(is_suspicious, last_activity);
CREATE INDEX idx_active_sessions_expires ON public.active_sessions(expires_at);

-- Table des tentatives d'accès aux données sensibles
CREATE TABLE public.data_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
  record_ids TEXT[], -- IDs des enregistrements accédés
  query_hash TEXT, -- Hash de la requête pour détecter les patterns
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  execution_time_ms INTEGER,
  row_count INTEGER DEFAULT 0
);

-- Index pour audit des accès aux données
CREATE INDEX idx_data_access_log_user_table ON public.data_access_log(user_id, table_name, created_at);
CREATE INDEX idx_data_access_log_table_operation ON public.data_access_log(table_name, operation, created_at);

-- RLS sur les tables d'audit (accès admin uniquement)
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès pour les tables d'audit
CREATE POLICY "Only admins can access security events" 
ON public.security_events 
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can access active sessions" 
ON public.active_sessions 
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can access data access logs" 
ON public.data_access_log 
FOR ALL
USING (is_admin(auth.uid()));

-- Fonction pour nettoyer automatiquement les anciennes données d'audit
CREATE OR REPLACE FUNCTION public.cleanup_audit_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer les événements de sécurité de plus de 1 an
  DELETE FROM public.security_events 
  WHERE created_at < now() - INTERVAL '1 year';
  
  -- Supprimer les sessions expirées
  DELETE FROM public.active_sessions 
  WHERE expires_at < now();
  
  -- Supprimer les logs d'accès de plus de 6 mois
  DELETE FROM public.data_access_log 
  WHERE created_at < now() - INTERVAL '6 months';
  
  -- Log de la maintenance
  INSERT INTO public.security_events (event_type, severity, event_details)
  VALUES ('audit_cleanup', 'low', '{"action": "automated_cleanup", "timestamp": "' || now() || '"}');
END;
$$;

-- Fonction pour détecter les activités suspectes
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_attempts INTEGER;
  different_ips INTEGER;
  risk_score INTEGER := 0;
BEGIN
  -- Compter les tentatives récentes du même utilisateur
  SELECT COUNT(*) INTO recent_attempts
  FROM public.security_events
  WHERE user_id = NEW.user_id 
    AND event_type = 'login_attempt'
    AND created_at > now() - INTERVAL '10 minutes';
  
  -- Compter les IP différentes récentes
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM public.security_events
  WHERE user_id = NEW.user_id 
    AND created_at > now() - INTERVAL '1 hour';
  
  -- Calcul du score de risque
  IF recent_attempts > 5 THEN
    risk_score := risk_score + 30;
  END IF;
  
  IF different_ips > 3 THEN
    risk_score := risk_score + 40;
  END IF;
  
  IF NEW.ip_address::TEXT ~ '^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)' THEN
    risk_score := risk_score - 10; -- IP locale, moins risqué
  END IF;
  
  -- Mettre à jour le score de risque
  NEW.risk_score := LEAST(risk_score, 100);
  
  -- Créer une alerte si score élevé
  IF risk_score >= 70 THEN
    NEW.severity := 'critical';
    
    -- Marquer la session comme suspecte si elle existe
    UPDATE public.active_sessions 
    SET is_suspicious = true 
    WHERE user_id = NEW.user_id;
  ELSIF risk_score >= 40 THEN
    NEW.severity := 'high';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour détecter automatiquement les activités suspectes
CREATE TRIGGER detect_suspicious_activity_trigger
  BEFORE INSERT ON public.security_events
  FOR EACH ROW
  WHEN (NEW.event_type IN ('login_attempt', 'mfa_challenge', 'password_change'))
  EXECUTE FUNCTION public.detect_suspicious_activity();

-- Fonction pour logger les accès aux données sensibles
CREATE OR REPLACE FUNCTION public.log_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Logger uniquement les opérations sur les tables sensibles
  IF TG_TABLE_NAME IN ('client_connections', 'personnel', 'settings', 'profiles') THEN
    INSERT INTO public.data_access_log (
      user_id,
      table_name,
      operation,
      record_ids,
      success,
      ip_address,
      row_count
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      TG_OP,
      CASE 
        WHEN TG_OP = 'DELETE' THEN ARRAY[OLD.id::TEXT]
        ELSE ARRAY[COALESCE(NEW.id::TEXT, OLD.id::TEXT)]
      END,
      true,
      inet_client_addr(),
      1
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers pour logger les accès aux données sensibles
CREATE TRIGGER log_client_connections_access
  AFTER INSERT OR UPDATE OR DELETE ON public.client_connections
  FOR EACH ROW EXECUTE FUNCTION public.log_data_access();

CREATE TRIGGER log_personnel_access
  AFTER INSERT OR UPDATE OR DELETE ON public.personnel
  FOR EACH ROW EXECUTE FUNCTION public.log_data_access();

CREATE TRIGGER log_settings_access
  AFTER INSERT OR UPDATE OR DELETE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.log_data_access();

CREATE TRIGGER log_profiles_access
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_data_access();