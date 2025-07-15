-- Ajouter les contraintes de clés étrangères après nettoyage

-- Contrainte project_day_locks -> projects
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_project_day_locks_project_id' 
        AND table_name = 'project_day_locks'
    ) THEN
        ALTER TABLE public.project_day_locks 
        ADD CONSTRAINT fk_project_day_locks_project_id 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Contrainte monthly_passage_distributions -> projects
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_monthly_passage_distributions_project_id' 
        AND table_name = 'monthly_passage_distributions'
    ) THEN
        ALTER TABLE public.monthly_passage_distributions 
        ADD CONSTRAINT fk_monthly_passage_distributions_project_id 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Contrainte project_teams -> projects
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_project_teams_project_id' 
        AND table_name = 'project_teams'
    ) THEN
        ALTER TABLE public.project_teams 
        ADD CONSTRAINT fk_project_teams_project_id 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Contrainte project_teams -> teams
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_project_teams_team_id' 
        AND table_name = 'project_teams'
    ) THEN
        ALTER TABLE public.project_teams 
        ADD CONSTRAINT fk_project_teams_team_id 
        FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Contrainte blank_worksheets -> projects
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_blank_worksheets_linked_project_id' 
        AND table_name = 'blank_worksheets'
    ) THEN
        ALTER TABLE public.blank_worksheets 
        ADD CONSTRAINT fk_blank_worksheets_linked_project_id 
        FOREIGN KEY (linked_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Contrainte blank_worksheet_consumables -> blank_worksheets
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_blank_worksheet_consumables_worksheet_id' 
        AND table_name = 'blank_worksheet_consumables'
    ) THEN
        ALTER TABLE public.blank_worksheet_consumables 
        ADD CONSTRAINT fk_blank_worksheet_consumables_worksheet_id 
        FOREIGN KEY (blank_worksheet_id) REFERENCES public.blank_worksheets(id) ON DELETE CASCADE;
    END IF;
END $$;