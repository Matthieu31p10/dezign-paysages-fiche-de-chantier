
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash, ExternalLink, FileText, FilePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatBytes } from '@/utils/format-helpers';
import { formatDate } from '@/utils/format-helpers';
import { ProjectDocument } from '@/types/document';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { downloadDocument, deleteDocument } from '@/services/documentService';

interface DocumentListProps {
  documents: ProjectDocument[];
  onDocumentDeleted?: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDocumentDeleted
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDownload = async (document: ProjectDocument) => {
    try {
      await downloadDocument(document);
      toast.success('Document téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      if (onDocumentDeleted) {
        onDocumentDeleted(documentId);
      }
      toast.success('Document supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du document');
    } finally {
      setDeletingId(null);
    }
  };
  
  if (documents.length === 0) {
    return (
      <div className="py-8 text-center">
        <FilePlus className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">Aucun document</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par télécharger votre premier document.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{document.name}</p>
              <div className="flex text-xs text-muted-foreground mt-1 space-x-4">
                <span>{document.fileType}</span>
                <span>{formatBytes(document.fileSize || 0)}</span>
                <span>{formatDate(document.createdAt.toString())}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDownload(document)}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => setDeletingId(document.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Le document sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => document.id === deletingId && handleDelete(document.id)}
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
