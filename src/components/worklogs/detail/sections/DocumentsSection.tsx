import React, { useState, useEffect } from 'react';
import { Paperclip, Download, Eye, Trash2 } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AttachedDocument {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  path?: string;
  url?: string;
}

const DocumentsDetailSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  const { getSignedUrl } = useFileUpload();
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const documents: AttachedDocument[] = workLog.attachedDocuments || [];

  useEffect(() => {
    // Generate signed URLs for documents that have paths
    const generateSignedUrls = async () => {
      const urlPromises = documents
        .filter(doc => doc.path)
        .map(async (doc) => {
          try {
            const signedUrl = await getSignedUrl(doc.path!);
            return { name: doc.name, url: signedUrl };
          } catch (error) {
            console.error(`Erreur pour le document ${doc.name}:`, error);
            return { name: doc.name, url: '' };
          }
        });

      const results = await Promise.all(urlPromises);
      const urlMap = results.reduce((acc, { name, url }) => {
        if (url) acc[name] = url;
        return acc;
      }, {} as Record<string, string>);

      setSignedUrls(urlMap);
    };

    if (documents.length > 0) {
      generateSignedUrls();
    }
  }, [documents, getSignedUrl]);

  if (!documents || documents.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (doc: AttachedDocument) => {
    const url = signedUrls[doc.name] || doc.url;
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Impossible d\'ouvrir le document');
    }
  };

  const handleDownloadDocument = async (doc: AttachedDocument) => {
    try {
      const url = signedUrls[doc.name] || doc.url;
      if (!url) {
        toast.error('URL du document non disponible');
        return;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur de téléchargement');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Document téléchargé');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Eye className="w-4 h-4 text-blue-500" />;
    }
    return <Paperclip className="w-4 h-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-blue-600" />
          Documents joints ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={`${doc.name}-${index}`}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)} • {doc.type}
                  </p>
                  {doc.lastModified && (
                    <p className="text-xs text-gray-400">
                      {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                  className="h-8 w-8 p-0"
                  title="Voir le document"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadDocument(doc)}
                  className="h-8 w-8 p-0"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsDetailSection;