
-- Ajouter une colonne couleur à la table teams
ALTER TABLE public.teams 
ADD COLUMN color TEXT DEFAULT '#10B981';

-- Créer une table temporaire avec les couleurs attribuées
WITH team_colors AS (
  SELECT 
    id,
    CASE 
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 1 THEN '#10B981'  -- green
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 2 THEN '#3B82F6'  -- blue
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 3 THEN '#8B5CF6'  -- purple
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 4 THEN '#F59E0B'  -- amber
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 5 THEN '#EF4444'  -- red
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 6 THEN '#EC4899'  -- pink
      WHEN (ROW_NUMBER() OVER (ORDER BY created_at)) % 8 = 7 THEN '#06B6D4'  -- cyan
      ELSE '#6B7280'  -- gray
    END as team_color
  FROM public.teams
)
-- Mettre à jour les équipes avec leurs couleurs respectives
UPDATE public.teams 
SET color = team_colors.team_color
FROM team_colors
WHERE teams.id = team_colors.id;
