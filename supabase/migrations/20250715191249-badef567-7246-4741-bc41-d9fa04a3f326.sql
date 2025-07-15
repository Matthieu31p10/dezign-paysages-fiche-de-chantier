-- Nettoyer les données orphelines avant d'ajouter les contraintes

-- Supprimer les project_day_locks qui référencent des projets inexistants
DELETE FROM public.project_day_locks 
WHERE project_id NOT IN (SELECT id FROM public.projects);

-- Supprimer les monthly_passage_distributions qui référencent des projets inexistants
DELETE FROM public.monthly_passage_distributions 
WHERE project_id NOT IN (SELECT id FROM public.projects);

-- Supprimer les project_documents qui référencent des projets inexistants
DELETE FROM public.project_documents 
WHERE project_id NOT IN (SELECT id FROM public.projects);

-- Supprimer les project_teams qui référencent des projets ou équipes inexistants
DELETE FROM public.project_teams 
WHERE project_id NOT IN (SELECT id FROM public.projects)
   OR team_id NOT IN (SELECT id FROM public.teams);

-- Nettoyer les blank_worksheets avec des linked_project_id inexistants
UPDATE public.blank_worksheets 
SET linked_project_id = NULL 
WHERE linked_project_id IS NOT NULL 
  AND linked_project_id NOT IN (SELECT id FROM public.projects);

-- Nettoyer les work_logs avec des project_id inexistants (on ne peut pas les supprimer car critiques)
-- On va plutôt créer un projet "Archive" pour les work_logs orphelins
INSERT INTO public.projects (id, name, address, is_archived) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Projets Archivés', 
  'Archive', 
  true
) ON CONFLICT (id) DO NOTHING;

-- Mettre à jour les work_logs orphelins vers le projet archive
UPDATE public.work_logs 
SET project_id = '00000000-0000-0000-0000-000000000000'
WHERE project_id NOT IN (SELECT id FROM public.projects WHERE id != '00000000-0000-0000-0000-000000000000');

-- Nettoyer les linked_project_id orphelins dans work_logs
UPDATE public.work_logs 
SET linked_project_id = NULL 
WHERE linked_project_id IS NOT NULL 
  AND linked_project_id NOT IN (SELECT id FROM public.projects);

-- Supprimer les consumables qui référencent des work_logs inexistants
DELETE FROM public.consumables 
WHERE work_log_id IS NOT NULL 
  AND work_log_id NOT IN (SELECT id FROM public.work_logs);

-- Supprimer les blank_worksheet_consumables qui référencent des blank_worksheets inexistants
DELETE FROM public.blank_worksheet_consumables 
WHERE blank_worksheet_id IS NOT NULL 
  AND blank_worksheet_id NOT IN (SELECT id FROM public.blank_worksheets);