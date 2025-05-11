
import { supabase } from '@/integrations/supabase/client';
import { ProjectDocument, formatDocumentFromDatabase } from '@/types/document';
import { toast } from 'sonner';

// Télécharger un document pour un projet
export const uploadProjectDocument = async (
  projectId: string,
  file: File
): Promise<ProjectDocument | null> => {
  try {
    // 1. Télécharger le fichier dans le bucket de stockage
    const filePath = `${projectId}/${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('Erreur de téléchargement:', storageError);
      throw new Error(`Erreur lors du téléchargement: ${storageError.message}`);
    }

    // 2. Créer une référence dans la table project_documents
    const { data: docData, error: docError } = await supabase
      .from('project_documents')
      .insert({
        project_id: projectId,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size
      })
      .select('*')
      .single();

    if (docError) {
      console.error('Erreur de création de référence:', docError);
      // Nettoyer le fichier téléchargé en cas d'erreur
      await supabase.storage.from('project-documents').remove([filePath]);
      throw new Error(`Erreur lors de l'enregistrement des métadonnées: ${docError.message}`);
    }

    return formatDocumentFromDatabase(docData);
  } catch (error) {
    console.error('Erreur de téléchargement du document:', error);
    toast.error('Erreur lors de l\'ajout du document');
    return null;
  }
};

// Récupérer tous les documents d'un projet
export const getProjectDocuments = async (projectId: string): Promise<ProjectDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur de récupération des documents:', error);
      throw error;
    }

    return data.map(formatDocumentFromDatabase);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    toast.error('Erreur lors de la récupération des documents');
    return [];
  }
};

// Télécharger un document
export const downloadProjectDocument = async (document: ProjectDocument): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('project-documents')
      .createSignedUrl(document.filePath, 60); // URL valide pendant 60 secondes

    if (error) {
      console.error('Erreur lors de la création de l\'URL de téléchargement:', error);
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    toast.error('Erreur lors du téléchargement du document');
    return null;
  }
};

// Supprimer un document
export const deleteProjectDocument = async (document: ProjectDocument): Promise<boolean> => {
  try {
    // 1. Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('project-documents')
      .remove([document.filePath]);

    if (storageError) {
      console.error('Erreur lors de la suppression du fichier:', storageError);
      throw storageError;
    }

    // 2. Supprimer la référence de la base de données
    const { error: dbError } = await supabase
      .from('project_documents')
      .delete()
      .eq('id', document.id);

    if (dbError) {
      console.error('Erreur lors de la suppression de la référence:', dbError);
      throw dbError;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    toast.error('Erreur lors de la suppression du document');
    return false;
  }
};
