-- Correction des warnings de sécurité détectés

-- 1. Correction des fonctions avec search_path mutable
CREATE OR REPLACE FUNCTION public.cleanup_audit_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.log_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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