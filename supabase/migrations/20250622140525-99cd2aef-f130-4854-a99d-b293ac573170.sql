
-- Créer une table pour stocker les verrouillages de projets par jour
CREATE TABLE public.project_day_locks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  reason TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter une contrainte unique pour éviter les doublons (un projet ne peut avoir qu'un seul verrouillage par jour de la semaine)
ALTER TABLE public.project_day_locks 
ADD CONSTRAINT unique_project_day_lock 
UNIQUE (project_id, day_of_week);

-- Activer Row Level Security
ALTER TABLE public.project_day_locks ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre toutes les opérations (pas d'authentification requise pour cette fonctionnalité)
CREATE POLICY "Enable all operations for project_day_locks" 
ON public.project_day_locks 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX idx_project_day_locks_project_id ON public.project_day_locks(project_id);
CREATE INDEX idx_project_day_locks_active ON public.project_day_locks(is_active);
