-- Correction du système de permissions et de la fonction is_admin

-- Amélioration de la fonction is_admin pour gérer les niveaux multiples
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = user_id),
    'user'
  );
$$;

-- Fonction pour vérifier le niveau de permission
CREATE OR REPLACE FUNCTION public.has_permission_level(user_id uuid, required_level text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE get_user_role(user_id)
      WHEN 'admin' THEN required_level IN ('readonly', 'user', 'manager', 'admin')
      WHEN 'manager' THEN required_level IN ('readonly', 'user', 'manager')
      WHEN 'user' THEN required_level IN ('readonly', 'user')
      WHEN 'readonly' THEN required_level = 'readonly'
      ELSE false
    END;
$$;

-- Mise à jour de la fonction is_admin pour plus de clarté
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_user_role(user_id) = 'admin';
$$;

-- Fonction pour vérifier si un utilisateur est manager ou plus
CREATE OR REPLACE FUNCTION public.is_manager_or_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_user_role(user_id) IN ('manager', 'admin');
$$;