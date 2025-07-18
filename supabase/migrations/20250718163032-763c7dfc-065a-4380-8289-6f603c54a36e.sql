-- Créer un utilisateur admin par défaut
-- Note: En production, utilisez des mots de passe plus sécurisés

-- Insérer un utilisateur admin dans auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_sent_at,
  recovery_token,
  email_change_sent_at,
  email_change,
  email_change_token_new,
  email_change_token_current,
  phone_change_sent_at,
  phone_change,
  phone_change_token,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@admin.com',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  '',
  null,
  '',
  null,
  '',
  '',
  '',
  null,
  null,
  '',
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "User", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Créer le profil correspondant
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  role,
  permissions
) 
SELECT 
  u.id,
  'Admin',
  'User',
  'admin@admin.com',
  'admin',
  '{"projects": true, "worklogs": true, "blanksheets": true, "admin": true}'::jsonb
FROM auth.users u 
WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  permissions = '{"projects": true, "worklogs": true, "blanksheets": true, "admin": true}'::jsonb;