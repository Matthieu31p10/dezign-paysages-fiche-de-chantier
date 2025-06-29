
-- Modifier la table projects pour supporter plusieurs équipes
ALTER TABLE projects DROP COLUMN team_id;

-- Créer une table de liaison pour les équipes et projets
CREATE TABLE project_teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, team_id)
);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_project_teams_project_id ON project_teams(project_id);
CREATE INDEX idx_project_teams_team_id ON project_teams(team_id);

-- Ajouter une contrainte pour s'assurer qu'il y a au moins une équipe primaire par projet
CREATE OR REPLACE FUNCTION ensure_primary_team()
RETURNS TRIGGER AS $$
BEGIN
  -- Si on supprime une équipe primaire, s'assurer qu'il en reste une autre
  IF OLD.is_primary = true AND NEW.is_primary = false THEN
    IF NOT EXISTS (
      SELECT 1 FROM project_teams 
      WHERE project_id = NEW.project_id AND is_primary = true AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Au moins une équipe doit être définie comme primaire pour ce projet';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_primary_team
  BEFORE UPDATE ON project_teams
  FOR EACH ROW
  EXECUTE FUNCTION ensure_primary_team();
