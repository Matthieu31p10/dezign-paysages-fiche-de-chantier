
import { ProjectDocument } from '@/types/document';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
