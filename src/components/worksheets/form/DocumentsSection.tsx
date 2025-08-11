import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Paperclip, Upload } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FileUpload from '@/components/ui/file-upload';
import FilePreview from '@/components/ui/file-preview';
import { toast } from 'sonner';

interface DocumentsSectionProps {
  isBlankWorksheet?: boolean;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ isBlankWorksheet = false }) => {
  const { control, setValue, watch } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const watchedDocuments = watch('attachedDocuments') || [];

  const handleFilesSelected = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    
    // Update form value with file names for now
    const fileNames = newFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    setValue('attachedDocuments', fileNames, { shouldValidate: true });
    toast.success(`${files.length} fichier(s) ajouté(s)`);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    const fileNames = newFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    setValue('attachedDocuments', fileNames, { shouldValidate: true });
    toast.success('Fichier supprimé');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-blue-600" />
          Documents joints
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ajoutez des photos ou documents pour le suivi de ce {isBlankWorksheet ? 'devis' : 'chantier'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="attachedDocuments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fichiers joints</FormLabel>
              <div className="space-y-4">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxFiles={10}
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
                  showCamera={true}
                />
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Fichiers sélectionnés ({selectedFiles.length})
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedFiles.map((file, index) => (
                        <FilePreview
                          key={`${file.name}-${file.lastModified}-${index}`}
                          file={file}
                          onRemove={() => handleRemoveFile(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;