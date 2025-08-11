import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files: File[], workLogId: string): Promise<UploadedFile[]> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedFiles: UploadedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${workLogId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Utilisateur non authentifié');
        }

        const filePath = `${user.id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('worklog-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Get public URL (even though bucket is private, we'll use signed URLs)
        const { data: { publicUrl } } = supabase.storage
          .from('worklog-documents')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          id: data.id || fileName,
          name: file.name,
          url: publicUrl,
          path: filePath,
          size: file.size,
          type: file.type
        });

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      toast.success(`${uploadedFiles.length} fichier(s) téléchargé(s) avec succès`);
      return uploadedFiles;

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement des fichiers');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getSignedUrl = async (path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('worklog-documents')
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'URL signée:', error);
      throw error;
    }
  };

  const deleteFile = async (path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('worklog-documents')
        .remove([path]);

      if (error) throw error;
      
      toast.success('Fichier supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du fichier');
      throw error;
    }
  };

  return {
    uploadFiles,
    getSignedUrl,
    deleteFile,
    isUploading,
    uploadProgress
  };
};