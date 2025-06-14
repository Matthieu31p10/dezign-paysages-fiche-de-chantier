
-- Étape 1: Supprimer la contrainte NOT NULL de project_id temporairement
ALTER TABLE work_logs ALTER COLUMN project_id DROP NOT NULL;

-- Étape 2: Créer une fonction pour vérifier si une chaîne est un UUID valide
CREATE OR REPLACE FUNCTION is_valid_uuid(input_text text)
RETURNS boolean AS $$
BEGIN
    -- Essayer de convertir en UUID, retourner false si ça échoue
    PERFORM input_text::uuid;
    RETURN true;
EXCEPTION WHEN invalid_text_representation THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Étape 3: Nettoyer les project_id invalides (les définir à NULL temporairement)
UPDATE work_logs 
SET project_id = NULL 
WHERE NOT is_valid_uuid(project_id);

-- Étape 4: Nettoyer les linked_project_id invalides
UPDATE work_logs 
SET linked_project_id = NULL 
WHERE linked_project_id IS NOT NULL AND NOT is_valid_uuid(linked_project_id);

-- Étape 5: Convertir les colonnes au type UUID
ALTER TABLE work_logs ALTER COLUMN project_id TYPE uuid USING 
  CASE 
    WHEN project_id IS NULL THEN NULL
    ELSE project_id::uuid 
  END;

ALTER TABLE work_logs ALTER COLUMN linked_project_id TYPE uuid USING 
  CASE 
    WHEN linked_project_id IS NULL THEN NULL
    ELSE linked_project_id::uuid 
  END;

-- Étape 6: Ajouter les contraintes de clé étrangère (project_id peut être NULL pour les fiches vierges)
ALTER TABLE work_logs 
ADD CONSTRAINT fk_work_logs_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE work_logs 
ADD CONSTRAINT fk_work_logs_linked_project_id 
FOREIGN KEY (linked_project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Étape 7: Ajouter la contrainte pour consumables
ALTER TABLE consumables 
ADD CONSTRAINT fk_consumables_work_log_id 
FOREIGN KEY (work_log_id) REFERENCES work_logs(id) ON DELETE CASCADE;

-- Étape 8: Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_work_logs_project_id ON work_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_date ON work_logs(date);
CREATE INDEX IF NOT EXISTS idx_consumables_work_log_id ON consumables(work_log_id);

-- Étape 9: Nettoyer la fonction temporaire
DROP FUNCTION is_valid_uuid(text);
