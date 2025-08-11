import React from 'react';
import { X, File, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="w-6 h-6 text-blue-500" />;
    if (isPDF) return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  return (
    <Card className="relative">
      <CardContent className="p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex items-start space-x-3">
          {isImage && imageUrl ? (
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={file.name}
                className="w-16 h-16 object-cover rounded border"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 rounded border">
              {getFileIcon()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
            <p className="text-xs text-gray-400">
              {file.type || 'Type inconnu'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilePreview;