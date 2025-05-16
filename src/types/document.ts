
import { ProjectInfo } from './models';

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  filePath: string;
  fileType: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadDocumentProps {
  projectId: string;
  file: File;
  onSuccess?: (document: ProjectDocument) => void;
  onError?: (error: Error) => void;
}

export interface DocumentListProps {
  projectId: string;
  documents: ProjectDocument[];
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: ProjectDocument) => void;
}

// Formater un document de la base de données vers l'application
export const formatDocumentFromDatabase = (doc: any): ProjectDocument => {
  return {
    id: doc.id,
    projectId: doc.project_id,
    name: doc.name,
    filePath: doc.file_path,
    fileType: doc.file_type,
    fileSize: doc.file_size || 0,
    createdAt: new Date(doc.created_at),
    updatedAt: new Date(doc.updated_at)
  };
};

// Formater un document de l'application vers la base de données
export const formatDocumentForDatabase = (doc: ProjectDocument): any => {
  return {
    id: doc.id,
    project_id: doc.projectId,
    name: doc.name,
    file_path: doc.filePath,
    file_type: doc.fileType,
    file_size: doc.fileSize,
    created_at: doc.createdAt.toISOString(),
    updated_at: doc.updatedAt.toISOString()
  };
};
