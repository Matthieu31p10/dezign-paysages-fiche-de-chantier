
-- Ajouter une colonne pour enregistrer qui a créé la fiche
ALTER TABLE work_logs ADD COLUMN created_by text;

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX idx_work_logs_created_by ON work_logs(created_by);
