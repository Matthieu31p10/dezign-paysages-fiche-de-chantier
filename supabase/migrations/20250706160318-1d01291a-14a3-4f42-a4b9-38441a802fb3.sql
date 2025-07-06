
-- Créer une table pour stocker les distributions mensuelles des passages
CREATE TABLE public.monthly_passage_distributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  monthly_visits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS
ALTER TABLE public.monthly_passage_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for monthly_passage_distributions" 
  ON public.monthly_passage_distributions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX idx_monthly_passage_distributions_project_id ON public.monthly_passage_distributions(project_id);
