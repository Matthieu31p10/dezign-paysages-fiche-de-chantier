import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProjectDocument = {
  id: string;
  project_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  created_at?: string;
  updated_at?: string;
};

export const useProjectDocuments = () => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);

  const uploadDocument = async (file: File, projectId: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('Project Documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { data, error: dbError } = await supabase
        .from('project_documents')
        .insert({
          project_id: projectId,
          name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Document téléchargé avec succès');
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erreur lors du téléchargement du document');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const getProjectDocuments = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Erreur lors du chargement des documents');
      return [];
    }
  };

  const downloadDocument = async (document: ProjectDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('Project Documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Téléchargement démarré');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('Project Documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document supprimé');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('Project Documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  return {
    uploadDocument,
    getProjectDocuments,
    downloadDocument,
    deleteDocument,
    getDocumentUrl,
    uploading,
    documents
  };
};