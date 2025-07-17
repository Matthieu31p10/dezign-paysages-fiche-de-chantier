
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { uploadProjectDocument } from '@/services/documentService';
import { toast } from 'sonner';
import { ProjectDocument } from '@/types/document';
import { cn } from '@/lib/utils';
import { handleFileUploadError } from '@/utils/errorHandler';

interface DocumentUploaderProps {
  projectId: string;
  onUploadSuccess?: (document: ProjectDocument) => void;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  projectId, 
  onUploadSuccess,
  className,
  buttonVariant = 'default'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Vérifier si le fichier est un PDF
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB)');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const document = await uploadProjectDocument(projectId, file);
      
      if (document) {
        toast.success('Document téléchargé avec succès');
        onUploadSuccess?.(document);
      }
    } catch (error) {
      handleFileUploadError(error, 'documentUpload');
      toast.error('Erreur lors du téléchargement du document');
    } finally {
      setIsUploading(false);
    }
  }, [projectId, onUploadSuccess]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isUploading,
    maxFiles: 1
  });
  
  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center py-4">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Téléchargement en cours...</p>
            </>
          ) : (
            <>
              <File className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium mb-1">Déposez votre document PDF ici</p>
              <p className="text-xs text-muted-foreground mb-2">ou cliquez pour sélectionner</p>
              <Button size="sm" variant={buttonVariant} className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Parcourir les fichiers
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PDF uniquement, max 5MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
