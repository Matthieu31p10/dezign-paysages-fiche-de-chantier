import React, { useRef, useState } from 'react';
import { Camera, Upload, X, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  showCamera?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  showCamera = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    if (fileArray.length > maxFiles) {
      toast.error(`Vous ne pouvez sélectionner que ${maxFiles} fichiers maximum`);
      return;
    }

    // Validate file types
    const validFiles = fileArray.filter(file => {
      const isValid = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      });
      
      if (!isValid) {
        toast.error(`Type de fichier non supporté: ${file.name}`);
      }
      
      return isValid;
    });

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choisir des fichiers
              </Button>
              
              {showCamera && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openCamera}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Prendre une photo
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              ou glissez-déposez vos fichiers ici
            </p>
            
            <p className="text-xs text-gray-400">
              Images, PDF, DOC (max {maxFiles} fichiers)
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;