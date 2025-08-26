-- Correction de la fonction de nettoyage avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.cleanup_security_data()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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