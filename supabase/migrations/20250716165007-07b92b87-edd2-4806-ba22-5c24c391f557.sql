-- Fix critical security issues: Use CASCADE to drop functions with their dependent triggers

-- Drop functions with CASCADE to automatically drop dependent triggers
DROP FUNCTION IF EXISTS public.update_settings_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_primary_team() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Enable RLS on missing tables
ALTER TABLE public.blank_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blank_worksheet_consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blank_worksheets
CREATE POLICY "Enable all operations for all users on blank_worksheets" 
ON public.blank_worksheets 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for blank_worksheet_consumables
CREATE POLICY "Enable all operations for all users on blank_worksheet_consumables" 
ON public.blank_worksheet_consumables 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for project_teams
CREATE POLICY "Enable all operations for all users on project_teams" 
ON public.project_teams 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Recreate functions with proper security
CREATE OR REPLACE FUNCTION public.update_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_primary_team()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $function$
BEGIN
  -- Si on supprime une équipe primaire, s'assurer qu'il en reste une autre
  IF OLD.is_primary = true AND NEW.is_primary = false THEN
    IF NOT EXISTS (
      SELECT 1 FROM project_teams 
      WHERE project_id = NEW.project_id AND is_primary = true AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Au moins une équipe doit être définie comme primaire pour ce projet';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Recreate triggers
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_updated_at();

CREATE TRIGGER trigger_ensure_primary_team
BEFORE UPDATE ON public.project_teams
FOR EACH ROW
EXECUTE FUNCTION public.ensure_primary_team();

CREATE TRIGGER update_personnel_updated_at
BEFORE UPDATE ON public.personnel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_day_locks_updated_at
BEFORE UPDATE ON public.project_day_locks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_passage_distributions_updated_at
BEFORE UPDATE ON public.monthly_passage_distributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();