-- ÉTAPE 1: SÉCURISATION IMMÉDIATE DES DONNÉES
-- Correction des 5 vulnérabilités critiques identifiées

-- 1. SÉCURISATION TABLE PROJECTS (Données clients)
-- Suppression des politiques publiques dangereuses
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.projects;

-- Nouvelles politiques sécurisées pour projects
CREATE POLICY "Authenticated users can view projects" 
ON public.projects FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can insert projects" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update projects" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete projects" 
ON public.projects FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- 2. SÉCURISATION TABLE PERSONNEL (Données employés)
-- Suppression des politiques publiques dangereuses
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.personnel;

-- Nouvelles politiques sécurisées pour personnel
CREATE POLICY "Only admins can view personnel data" 
ON public.personnel FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage personnel" 
ON public.personnel FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 3. SÉCURISATION TABLE CLIENT_CONNECTIONS (Identifiants clients)
-- Suppression des politiques publiques dangereuses
DROP POLICY IF EXISTS "Enable all operations for client_connections" ON public.client_connections;

-- Nouvelles politiques ultra-sécurisées pour client_connections
CREATE POLICY "Only super admins can view client credentials" 
ON public.client_connections FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only super admins can manage client credentials" 
ON public.client_connections FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 4. SÉCURISATION TABLE SETTINGS (Configuration entreprise)
-- Suppression des politiques publiques dangereuses
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.settings;

-- Nouvelles politiques sécurisées pour settings
CREATE POLICY "Authenticated users can view basic settings" 
ON public.settings FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can modify settings" 
ON public.settings FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can insert settings" 
ON public.settings FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete settings" 
ON public.settings FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- 5. SÉCURISATION TABLE WORK_LOGS (Journaux de travail)
-- Suppression des politiques publiques dangereuses
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.work_logs;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.work_logs;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.work_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.work_logs;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.work_logs;

-- Nouvelles politiques sécurisées pour work_logs
CREATE POLICY "Authenticated users can view work logs" 
ON public.work_logs FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create work logs" 
ON public.work_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update their own work logs or admins can update all" 
ON public.work_logs FOR UPDATE 
TO authenticated 
USING (created_by = (auth.jwt() ->> 'email') OR is_admin(auth.uid()));

CREATE POLICY "Only admins can delete work logs" 
ON public.work_logs FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- SÉCURISATION BONUS: Tables auxiliaires critiques

-- Sécurisation table consumables
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.consumables;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.consumables;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.consumables;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.consumables;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.consumables;

CREATE POLICY "Authenticated users can manage consumables" 
ON public.consumables FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Sécurisation table saved_consumables
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.saved_consumables;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.saved_consumables;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.saved_consumables;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.saved_consumables;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.saved_consumables;

CREATE POLICY "Authenticated users can manage saved consumables" 
ON public.saved_consumables FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Sécurisation table teams
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.teams;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.teams;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.teams;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teams;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.teams;

CREATE POLICY "Authenticated users can view teams" 
ON public.teams FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage teams" 
ON public.teams FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update teams" 
ON public.teams FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete teams" 
ON public.teams FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- Sécurisation custom_tasks
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.custom_tasks;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.custom_tasks;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.custom_tasks;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.custom_tasks;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.custom_tasks;

CREATE POLICY "Authenticated users can manage custom tasks" 
ON public.custom_tasks FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);