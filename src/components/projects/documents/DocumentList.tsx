
import React, { useState } from 'react';
import { ProjectDocument } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteProjectDocument, downloadProjectDocument } from '@/services/documentService';
import { formatBytes, formatDate } from '@/utils/format-helpers';
import { toast } from 'sonner';

interface DocumentListProps {
  documents: ProjectDocument[];
  onDocumentDeleted?: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentDeleted }) => {
  const [documentToDelete, setDocumentToDelete] = useState<ProjectDocument | null>(null);
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  
  const handleDownload = async (document: ProjectDocument) => {
    setIsDownloading(prev => ({ ...prev, [document.id]: true }));
    
    try {
      const downloadUrl = await downloadProjectDocument(document);
      if (downloadUrl) {
        // Créer un lien et déclencher le téléchargement
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', document.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Téléchargement démarré');
      }
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error('Erreur lors du téléchargement du document');
    } finally {
      setIsDownloading(prev => ({ ...prev, [document.id]: false }));
    }
  };
  
  const confirmDelete = (document: ProjectDocument) => {
    setDocumentToDelete(document);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    const documentId = documentToDelete.id;
    setIsDeleting(prev => ({ ...prev, [documentId]: true }));
    
    try {
      const success = await deleteProjectDocument(documentToDelete);
      if (success) {
        toast.success('Document supprimé avec succès');
        onDocumentDeleted?.(documentId);
      }
    } catch (error) {
      console.error('Erreur de suppression:', error);
    } finally {
      setIsDeleting(prev => ({ ...prev, [documentId]: false }));
      setDocumentToDelete(null);
    }
  };
  
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucun document</h3>
        <p className="text-muted-foreground">
          Aucun document n'a été ajouté à ce projet pour le moment.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {documents.map((document) => (
          <Card key={document.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{document.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{document.fileType.split('/')[1]?.toUpperCase()}</span>
                      <span className="mx-1">•</span>
                      <span>{document.fileSize ? formatBytes(document.fileSize) : 'N/A'}</span>
                      <span className="mx-1">•</span>
                      <span>Ajouté le {formatDate(document.createdAt.toISOString())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(document)}
                    disabled={isDownloading[document.id]}
                  >
                    {isDownloading[document.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => confirmDelete(document)} 
                    disabled={isDeleting[document.id]}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    {isDeleting[document.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting[documentToDelete?.id || '']}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting[documentToDelete?.id || '']} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting[documentToDelete?.id || ''] ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentList;
