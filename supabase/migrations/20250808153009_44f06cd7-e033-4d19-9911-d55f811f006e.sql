-- Corriger les fonctions existantes pour la sécurité
-- Mise à jour de la fonction handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role, permissions)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'user'),
    COALESCE((new.raw_user_meta_data ->> 'permissions')::jsonb, '{"projects": true, "worklogs": true, "blanksheets": true}'::jsonb)
  );
  RETURN new;
END;
$function$;

-- Mise à jour de la fonction is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE 
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$function$;

-- Mise à jour de la fonction ensure_primary_team
CREATE OR REPLACE FUNCTION public.ensure_primary_team()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Si on supprime une équipe primaire, s'assurer qu'il en reste une autre
  IF OLD.is_primary = true AND NEW.is_primary = false THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.project_teams 
      WHERE project_id = NEW.project_id AND is_primary = true AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Au moins une équipe doit être définie comme primaire pour ce projet';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;