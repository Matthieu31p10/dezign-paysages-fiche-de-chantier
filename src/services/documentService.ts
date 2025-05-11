
import { ProjectDocument } from '@/types/document';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatDocumentFromDatabase } from '@/types/document';

/**
 * Récupère les documents d'un projet
 */
export const getProjectDocuments = async (projectId: string): Promise<ProjectDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw error;
    }
    
    // Formater les documents pour l'application
    return (data || []).map(doc => formatDocumentFromDatabase(doc));
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    toast.error('Impossible de charger les documents du projet');
    return [];
  }
};

/**
 * Télécharge un document depuis le stockage
 */
export const downloadDocument = async (document: ProjectDocument): Promise<void> => {
  try {
    // Vérification des données
    if (!document || !document.filePath) {
      throw new Error('Document invalide');
    }
    
    // Extraction du chemin de stockage
    const filePath = document.filePath;
    
    // Téléchargement depuis le stockage Supabase
    const { data, error } = await supabase.storage
      .from('project-documents')
      .download(filePath);
      
    if (error) {
      console.error('Erreur de téléchargement:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Aucune donnée reçue');
    }
    
    // Utilisation de FileSaver pour télécharger le fichier
    saveAs(data, document.name);
    
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    toast.error('Impossible de télécharger le document');
    throw error;
  }
};

/**
 * Télécharge un document vers le stockage
 */
export const uploadProjectDocument = async (projectId: string, file: File): Promise<ProjectDocument> => {
  try {
    // Vérification des paramètres
    if (!projectId || !file) {
      throw new Error('Paramètres invalides');
    }
    
    // Générer un nom de fichier unique pour éviter les collisions
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${projectId}_${timestamp}.${fileExtension}`;
    const filePath = `${projectId}/${fileName}`;
    
    // Télécharger le fichier dans le stockage
    const { error: uploadError } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Erreur de téléchargement:', uploadError);
      throw uploadError;
    }
    
    // Créer une entrée dans la base de données
    const documentData = {
      project_id: projectId,
      name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
    };
    
    const { data, error: dbError } = await supabase
      .from('project_documents')
      .insert(documentData)
      .select('*')
      .single();
    
    if (dbError || !data) {
      console.error('Erreur lors de la création de l\'entrée en base de données:', dbError);
      
      // Essayer de supprimer le fichier téléchargé si l'insertion en base a échoué
      await supabase.storage
        .from('project-documents')
        .remove([filePath]);
        
      throw dbError || new Error('Échec de création de l\'entrée en base de données');
    }
    
    // Formater et retourner le document
    return formatDocumentFromDatabase(data);
    
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    toast.error('Impossible de télécharger le document');
    throw error;
  }
};

/**
 * Supprime un document du stockage et de la base de données
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    // Récupérer d'abord les informations du document pour connaître le chemin fichier
    const { data: document, error: fetchError } = await supabase
      .from('project_documents')
      .select('*')
      .eq('id', documentId)
      .single();
      
    if (fetchError || !document) {
      console.error('Erreur lors de la récupération du document:', fetchError);
      throw fetchError || new Error('Document non trouvé');
    }
    
    // Suppression du fichier dans le stockage
    const { error: storageError } = await supabase.storage
      .from('project-documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error('Erreur lors de la suppression du fichier:', storageError);
      // On continue quand même pour supprimer la référence en base
    }
    
    // Suppression de la référence en base de données
    const { error: dbError } = await supabase
      .from('project_documents')
      .delete()
      .eq('id', documentId);
      
    if (dbError) {
      console.error('Erreur lors de la suppression de la référence:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    toast.error('Impossible de supprimer le document');
    throw error;
  }
};
