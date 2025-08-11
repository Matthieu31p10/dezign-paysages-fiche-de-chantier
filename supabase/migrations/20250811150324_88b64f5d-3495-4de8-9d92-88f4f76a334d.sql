-- Créer un bucket pour les documents et photos des fiches vierges
INSERT INTO storage.buckets (id, name, public) VALUES ('worklog-documents', 'worklog-documents', false);

-- Politique pour permettre aux utilisateurs de voir leurs propres documents
CREATE POLICY "Users can view their own worklog documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'worklog-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Politique pour permettre aux utilisateurs d'uploader leurs propres documents
CREATE POLICY "Users can upload their own worklog documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'worklog-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres documents
CREATE POLICY "Users can delete their own worklog documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'worklog-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ajouter une colonne pour stocker les documents joints dans les fiches de suivi
ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS attached_documents JSONB DEFAULT '[]'::jsonb;