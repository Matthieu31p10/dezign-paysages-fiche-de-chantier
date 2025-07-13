-- Création d'une table complète pour la gestion du personnel
-- Si la table existe déjà, on la met à jour, sinon on la crée

-- Création de la table personnel (ou mise à jour si elle existe)
CREATE TABLE IF NOT EXISTS public.personnel (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  position text,
  email text,
  phone text,
  driving_license text,
  employee_id text UNIQUE,
  hire_date date,
  hourly_rate numeric(10,2),
  active boolean NOT NULL DEFAULT true,
  skills text[],
  notes text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ajout de colonnes si elles n'existent pas déjà
DO $$ 
BEGIN
  -- Ajouter email si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'email') THEN
    ALTER TABLE public.personnel ADD COLUMN email text;
  END IF;
  
  -- Ajouter phone si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'phone') THEN
    ALTER TABLE public.personnel ADD COLUMN phone text;
  END IF;
  
  -- Ajouter driving_license si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'driving_license') THEN
    ALTER TABLE public.personnel ADD COLUMN driving_license text;
  END IF;
  
  -- Ajouter employee_id si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'employee_id') THEN
    ALTER TABLE public.personnel ADD COLUMN employee_id text UNIQUE;
  END IF;
  
  -- Ajouter hire_date si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'hire_date') THEN
    ALTER TABLE public.personnel ADD COLUMN hire_date date;
  END IF;
  
  -- Ajouter hourly_rate si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'hourly_rate') THEN
    ALTER TABLE public.personnel ADD COLUMN hourly_rate numeric(10,2);
  END IF;
  
  -- Ajouter skills si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'skills') THEN
    ALTER TABLE public.personnel ADD COLUMN skills text[];
  END IF;
  
  -- Ajouter notes si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'notes') THEN
    ALTER TABLE public.personnel ADD COLUMN notes text;
  END IF;
  
  -- Ajouter emergency_contact_name si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'emergency_contact_name') THEN
    ALTER TABLE public.personnel ADD COLUMN emergency_contact_name text;
  END IF;
  
  -- Ajouter emergency_contact_phone si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'emergency_contact_phone') THEN
    ALTER TABLE public.personnel ADD COLUMN emergency_contact_phone text;
  END IF;
  
  -- Ajouter updated_at si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'personnel' AND column_name = 'updated_at') THEN
    ALTER TABLE public.personnel ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();
  END IF;
END $$;

-- Activer Row Level Security
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.personnel;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.personnel;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.personnel;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.personnel;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.personnel;

-- Politiques pour permettre toutes les opérations (adapté pour une app interne)
CREATE POLICY "Enable all operations for all users" 
ON public.personnel 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_personnel_name ON public.personnel(name);
CREATE INDEX IF NOT EXISTS idx_personnel_active ON public.personnel(active);
CREATE INDEX IF NOT EXISTS idx_personnel_position ON public.personnel(position);
CREATE INDEX IF NOT EXISTS idx_personnel_employee_id ON public.personnel(employee_id);

-- Créer ou mettre à jour la fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour la mise à jour automatique du champ updated_at
DROP TRIGGER IF EXISTS update_personnel_updated_at ON public.personnel;
CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON public.personnel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques données d'exemple si la table est vide
INSERT INTO public.personnel (name, position, email, phone, active, skills)
SELECT 'Jean Dupont', 'Chef d''équipe', 'jean.dupont@example.com', '06.12.34.56.78', true, ARRAY['Conduite', 'Jardinage', 'Élagage']
WHERE NOT EXISTS (SELECT 1 FROM public.personnel WHERE name = 'Jean Dupont');

INSERT INTO public.personnel (name, position, email, phone, active, skills)
SELECT 'Marie Martin', 'Jardinière', 'marie.martin@example.com', '06.87.65.43.21', true, ARRAY['Plantations', 'Arrosage', 'Taille']
WHERE NOT EXISTS (SELECT 1 FROM public.personnel WHERE name = 'Marie Martin');

INSERT INTO public.personnel (name, position, email, phone, active, skills)
SELECT 'Pierre Durand', 'Ouvrier paysagiste', 'pierre.durand@example.com', '06.55.44.33.22', true, ARRAY['Terrassement', 'Maçonnerie paysagère']
WHERE NOT EXISTS (SELECT 1 FROM public.personnel WHERE name = 'Pierre Durand');