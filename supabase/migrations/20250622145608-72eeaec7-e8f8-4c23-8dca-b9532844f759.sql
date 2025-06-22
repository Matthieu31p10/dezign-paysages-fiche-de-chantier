
-- Ajouter un champ pour le délai minimum entre passages (en jours)
ALTER TABLE public.project_day_locks 
ADD COLUMN min_days_between_visits INTEGER DEFAULT NULL;

-- Ajouter un commentaire pour expliquer le champ
COMMENT ON COLUMN public.project_day_locks.min_days_between_visits IS 'Délai minimum en jours entre les passages pour ce jour de la semaine. NULL = verrouillage complet';
