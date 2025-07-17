import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Download, Trash2, Eye } from 'lucide-react';
import { useProjectDocuments, ProjectDocument } from '@/hooks/useProjectDocuments';
import { formatFileSize } from '@/utils/fileUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectDocumentsProps {
  projectId: string;
}

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId }) => {
  const {
    uploadDocument,
    getProjectDocuments,
    downloadDocument,
    deleteDocument,
    getDocumentUrl,
    uploading,
    documents
  } = useProjectDocuments();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  const loadDocuments = async () => {
    setLoading(true);
    await getProjectDocuments(projectId);
    setLoading(false);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        await uploadDocument(file, projectId);
        await loadDocuments(); // Refresh the list
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDownload = async (document: ProjectDocument) => {
    await downloadDocument(document);
  };

  const handleDelete = async (document: ProjectDocument) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      await deleteDocument(document.id, document.file_path);
    }
  };

  const handlePreview = async (document: ProjectDocument) => {
    const url = await getDocumentUrl(document.file_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📎';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des documents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents du Projet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg font-medium">Déposez vos fichiers ici...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, Images, Word, Excel, Texte (max. 10MB)
              </p>
            </div>
          )}
          {uploading && (
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Téléchargement en cours...
              </div>
            </div>
          )}
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            <Separator />
            <h3 className="font-semibold">Documents ({documents.length})</h3>
            <div className="grid gap-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">
                      {getFileIcon(document.file_type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{document.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {document.file_type.split('/')[1]?.toUpperCase()}
                        </Badge>
                        {document.file_size && (
                          <span>{formatFileSize(document.file_size)}</span>
                        )}
                        {document.created_at && (
                          <span>
                            {new Date(document.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Aucun document associé à ce projet. Utilisez la zone de téléchargement ci-dessus pour ajouter des fichiers.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDocuments;