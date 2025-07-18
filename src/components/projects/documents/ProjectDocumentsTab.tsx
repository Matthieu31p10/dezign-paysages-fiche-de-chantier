
import React, { useEffect, useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { ProjectDocument } from '@/types/document';
import { getProjectDocuments } from '@/services/documentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText } from 'lucide-react';
import DocumentUploader from './DocumentUploader';
import DocumentList from './DocumentList';

interface ProjectDocumentsTabProps {
  project: ProjectInfo;
}

const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({ project }) => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getProjectDocuments(project.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, [project.id]);
  
  const handleUploadSuccess = (document: ProjectDocument) => {
    setDocuments(prev => [document, ...prev]);
  };
  
  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Documents du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploader 
            projectId={project.id} 
            onUploadSuccess={handleUploadSuccess}
          />
          
          <Separator className="my-6" />
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DocumentList 
              documents={documents} 
              onDocumentDeleted={handleDocumentDeleted}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocumentsTab;
