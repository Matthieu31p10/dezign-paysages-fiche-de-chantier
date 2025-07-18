-- Mettre à jour le profil de Matthieu pour qu'il soit admin
UPDATE public.profiles 
SET role = 'admin', 
    permissions = '{"projects": true, "worklogs": true, "blanksheets": true, "admin": true}'::jsonb
WHERE email = 'matthieubellia31@gmail.com';