
// Si ce fichier n'existe pas déjà, création d'un fichier pour les types de document

export interface ProjectDocument {
  id: string;
  name: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  projectId: string;
  createdAt: string;
  updatedAt?: string;
}

// Types pour les documents venant de la base de données Supabase
export interface DatabaseProjectDocument {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  project_id: string;
  created_at: string;
  updated_at?: string;
}

// Fonction pour convertir un document de la base de données vers le format de l'application
export function formatDocumentFromDatabase(doc: DatabaseProjectDocument): ProjectDocument {
  return {
    id: doc.id,
    name: doc.name,
    filePath: doc.file_path,
    fileType: doc.file_type,
    fileSize: doc.file_size,
    projectId: doc.project_id,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at
  };
}
