-- Ajouter les contraintes de clés étrangères manquantes

-- Relation work_logs -> projects
ALTER TABLE public.work_logs 
ADD CONSTRAINT fk_work_logs_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Relation work_logs -> projects (linked_project_id)
ALTER TABLE public.work_logs 
ADD CONSTRAINT fk_work_logs_linked_project_id 
FOREIGN KEY (linked_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

-- Relation consumables -> work_logs
ALTER TABLE public.consumables 
ADD CONSTRAINT fk_consumables_work_log_id 
FOREIGN KEY (work_log_id) REFERENCES public.work_logs(id) ON DELETE CASCADE;

-- Relation blank_worksheet_consumables -> blank_worksheets
ALTER TABLE public.blank_worksheet_consumables 
ADD CONSTRAINT fk_blank_worksheet_consumables_worksheet_id 
FOREIGN KEY (blank_worksheet_id) REFERENCES public.blank_worksheets(id) ON DELETE CASCADE;

-- Relation project_documents -> projects
ALTER TABLE public.project_documents 
ADD CONSTRAINT fk_project_documents_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Relation project_teams -> projects
ALTER TABLE public.project_teams 
ADD CONSTRAINT fk_project_teams_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Relation project_teams -> teams
ALTER TABLE public.project_teams 
ADD CONSTRAINT fk_project_teams_team_id 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Relation project_day_locks -> projects
ALTER TABLE public.project_day_locks 
ADD CONSTRAINT fk_project_day_locks_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Relation monthly_passage_distributions -> projects
ALTER TABLE public.monthly_passage_distributions 
ADD CONSTRAINT fk_monthly_passage_distributions_project_id 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Relation blank_worksheets -> projects (linked_project_id)
ALTER TABLE public.blank_worksheets 
ADD CONSTRAINT fk_blank_worksheets_linked_project_id 
FOREIGN KEY (linked_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;