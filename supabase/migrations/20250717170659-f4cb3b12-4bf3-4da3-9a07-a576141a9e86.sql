-- Trigger pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Trigger déclenché lors de la création d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();