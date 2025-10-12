-- ============================================
-- CRITICAL SECURITY FIXES
-- ============================================

-- 1. CREATE USER ROLES SYSTEM (Fixes Privilege Escalation)
-- ============================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user', 'readonly');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role_secure(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 4
      WHEN 'manager' THEN 3
      WHEN 'user' THEN 2
      WHEN 'readonly' THEN 1
    END DESC
  LIMIT 1;
$$;

-- Create improved is_admin function
CREATE OR REPLACE FUNCTION public.is_admin_secure(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin');
$$;

-- Create is_manager_or_admin function
CREATE OR REPLACE FUNCTION public.is_manager_or_admin_secure(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('admin', 'manager')
  );
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. FIX OVERLY PERMISSIVE RLS POLICIES
-- ============================================

-- Drop and recreate policies for blank_worksheets
DROP POLICY IF EXISTS "Enable all operations for all users on blank_worksheets" ON public.blank_worksheets;

CREATE POLICY "Users can view blank worksheets they created"
ON public.blank_worksheets
FOR SELECT
TO authenticated
USING (created_by = (auth.jwt() ->> 'email') OR public.is_manager_or_admin_secure(auth.uid()));

CREATE POLICY "Users can create their own blank worksheets"
ON public.blank_worksheets
FOR INSERT
TO authenticated
WITH CHECK (created_by = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update their own blank worksheets"
ON public.blank_worksheets
FOR UPDATE
TO authenticated
USING (created_by = (auth.jwt() ->> 'email') OR public.is_manager_or_admin_secure(auth.uid()));

CREATE POLICY "Only admins can delete blank worksheets"
ON public.blank_worksheets
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Fix blank_worksheet_consumables policies
DROP POLICY IF EXISTS "Enable all operations for all users on blank_worksheet_consumab" ON public.blank_worksheet_consumables;

CREATE POLICY "Users can manage consumables for their worksheets"
ON public.blank_worksheet_consumables
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.blank_worksheets
    WHERE id = blank_worksheet_id
    AND (created_by = (auth.jwt() ->> 'email') OR public.is_manager_or_admin_secure(auth.uid()))
  )
);

-- Fix consumables policies
DROP POLICY IF EXISTS "Authenticated users can manage consumables" ON public.consumables;

CREATE POLICY "Users can manage consumables for their work logs"
ON public.consumables
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.work_logs
    WHERE id = work_log_id
    AND (created_by = (auth.jwt() ->> 'email') OR public.is_manager_or_admin_secure(auth.uid()))
  )
);

-- Fix custom_tasks policies
DROP POLICY IF EXISTS "Authenticated users can manage custom tasks" ON public.custom_tasks;

CREATE POLICY "Only managers and admins can manage custom tasks"
ON public.custom_tasks
FOR ALL
TO authenticated
USING (public.is_manager_or_admin_secure(auth.uid()))
WITH CHECK (public.is_manager_or_admin_secure(auth.uid()));

-- Fix monthly_passage_distributions policies
DROP POLICY IF EXISTS "Enable all operations for monthly_passage_distributions" ON public.monthly_passage_distributions;

CREATE POLICY "Only admins can manage monthly passage distributions"
ON public.monthly_passage_distributions
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()))
WITH CHECK (public.is_admin_secure(auth.uid()));

-- Fix project_day_locks policies
DROP POLICY IF EXISTS "Enable all operations for project_day_locks" ON public.project_day_locks;

CREATE POLICY "Only admins can manage project day locks"
ON public.project_day_locks
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()))
WITH CHECK (public.is_admin_secure(auth.uid()));

-- Fix active_sessions policies - remove overly permissive policy
DROP POLICY IF EXISTS "System can manage sessions" ON public.active_sessions;

-- 3. RESTRICT PERSONNEL PII ACCESS
-- ============================================

-- Drop existing overly permissive personnel policies
DROP POLICY IF EXISTS "Authenticated users can view personnel" ON public.personnel;
DROP POLICY IF EXISTS "Authenticated users can insert personnel" ON public.personnel;
DROP POLICY IF EXISTS "Authenticated users can update personnel" ON public.personnel;
DROP POLICY IF EXISTS "Authenticated users can delete personnel" ON public.personnel;

-- Create restricted policies for personnel
CREATE POLICY "Only admins and managers can view personnel"
ON public.personnel
FOR SELECT
TO authenticated
USING (public.is_manager_or_admin_secure(auth.uid()));

CREATE POLICY "Only admins can manage personnel"
ON public.personnel
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()))
WITH CHECK (public.is_admin_secure(auth.uid()));

-- 4. UPDATE PROFILES TABLE POLICIES
-- ============================================

-- Drop old policies that reference profiles.role
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create new policies using user_roles
CREATE POLICY "Admins can view all profiles using roles table"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_secure(auth.uid()) OR auth.uid() = id);

CREATE POLICY "Admins can update all profiles using roles table"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin_secure(auth.uid()) OR auth.uid() = id);

-- Users should not be able to update their own role field
-- (This will be enforced at application level)

-- 5. UPDATE EXISTING FUNCTION REFERENCES
-- ============================================

-- Update projects policies to use new secure functions
DROP POLICY IF EXISTS "Only admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can update projects" ON public.projects;

CREATE POLICY "Only admins can delete projects secure"
ON public.projects
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can insert projects secure"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can update projects secure"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Update teams policies
DROP POLICY IF EXISTS "Only admins can delete teams" ON public.teams;
DROP POLICY IF EXISTS "Only admins can manage teams" ON public.teams;
DROP POLICY IF EXISTS "Only admins can update teams" ON public.teams;

CREATE POLICY "Only admins can delete teams secure"
ON public.teams
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can insert teams secure"
ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can update teams secure"
ON public.teams
FOR UPDATE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Update settings policies
DROP POLICY IF EXISTS "Only admins can modify settings" ON public.settings;
DROP POLICY IF EXISTS "Only admins can insert settings" ON public.settings;
DROP POLICY IF EXISTS "Only admins can delete settings" ON public.settings;

CREATE POLICY "Only admins can modify settings secure"
ON public.settings
FOR UPDATE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can insert settings secure"
ON public.settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can delete settings secure"
ON public.settings
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Update work_logs policies
DROP POLICY IF EXISTS "Users can update their own work logs or admins can update all" ON public.work_logs;
DROP POLICY IF EXISTS "Only admins can delete work logs" ON public.work_logs;

CREATE POLICY "Users can update their own work logs or admins can update all secure"
ON public.work_logs
FOR UPDATE
TO authenticated
USING (created_by = (auth.jwt() ->> 'email') OR public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can delete work logs secure"
ON public.work_logs
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Update client_connections policies
DROP POLICY IF EXISTS "Only super admins can manage client credentials" ON public.client_connections;
DROP POLICY IF EXISTS "Only super admins can view client credentials" ON public.client_connections;

CREATE POLICY "Only admins can view client credentials secure"
ON public.client_connections
FOR SELECT
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can manage client credentials secure"
ON public.client_connections
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()))
WITH CHECK (public.is_admin_secure(auth.uid()));

-- Update security tables policies
DROP POLICY IF EXISTS "Only admins can access active sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Only admins can access security events" ON public.security_events;
DROP POLICY IF EXISTS "Only admins can access data access logs" ON public.data_access_log;

CREATE POLICY "Only admins can access active sessions secure"
ON public.active_sessions
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can access security events secure"
ON public.security_events
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Only admins can access data access logs secure"
ON public.data_access_log
FOR ALL
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- Update login_history policies
DROP POLICY IF EXISTS "Admins can view all login history" ON public.login_history;
DROP POLICY IF EXISTS "Admins can insert login history" ON public.login_history;
DROP POLICY IF EXISTS "Admins can delete login history" ON public.login_history;

CREATE POLICY "Admins can view all login history secure"
ON public.login_history
FOR SELECT
TO authenticated
USING (public.is_admin_secure(auth.uid()));

CREATE POLICY "Admins can insert login history secure"
ON public.login_history
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_secure(auth.uid()));

CREATE POLICY "Admins can delete login history secure"
ON public.login_history
FOR DELETE
TO authenticated
USING (public.is_admin_secure(auth.uid()));

-- 6. ADD PASSWORD HASHING SUPPORT FOR CLIENT CONNECTIONS
-- ============================================

-- Add new column for hashed passwords
ALTER TABLE public.client_connections 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create function to verify client passwords
CREATE OR REPLACE FUNCTION public.verify_client_password(
  _email TEXT,
  _password TEXT
)
RETURNS TABLE (
  id UUID,
  client_name TEXT,
  email TEXT,
  assigned_projects TEXT[],
  visibility_permissions JSONB,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be updated to use bcrypt once passwords are migrated
  -- For now, it maintains backward compatibility
  RETURN QUERY
  SELECT 
    cc.id,
    cc.client_name,
    cc.email,
    cc.assigned_projects,
    cc.visibility_permissions,
    cc.is_active
  FROM public.client_connections cc
  WHERE cc.email = _email 
    AND cc.is_active = true
    AND (
      -- Support both old plaintext (temporary) and new hashed passwords
      cc.password = _password 
      OR (cc.password_hash IS NOT NULL AND cc.password_hash = crypt(_password, cc.password_hash))
    );
END;
$$;

-- Add comment explaining migration strategy
COMMENT ON COLUMN public.client_connections.password_hash IS 
  'Hashed password using bcrypt. Once all passwords are migrated, the plaintext password column should be dropped.';

COMMENT ON COLUMN public.client_connections.password IS 
  'DEPRECATED: Plaintext password. Will be removed after migration to password_hash is complete.';