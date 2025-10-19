import { useState, useCallback, useEffect } from 'react';
import {
  compressImage,
  convertToWebP,
  supportsWebP,
  type ImageCompressionOptions
} from '@/utils/imageOptimization';

interface UseImageOptimizationOptions {
  autoCompress?: boolean;
  autoWebP?: boolean;
  compressionOptions?: ImageCompressionOptions;
}

/**
 * Hook pour optimiser les images uploadées
 */
export const useImageOptimization = (options: UseImageOptimizationOptions = {}) => {
  const {
    autoCompress = true,
    autoWebP = true,
    compressionOptions = {}
  } = options;

  const [isCompressing, setIsCompressing] = useState(false);
  const [webPSupported, setWebPSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Check WebP support on mount
  useEffect(() => {
    supportsWebP().then(setWebPSupported);
  }, []);

  /**
   * Optimise une image (compression + WebP si supporté)
   */
  const optimizeImage = useCallback(async (
    file: File
  ): Promise<{ original: File; compressed?: Blob; webp?: Blob }> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }

    setIsCompressing(true);
    setError(null);

    try {
      const result: { original: File; compressed?: Blob; webp?: Blob } = {
        original: file
      };

      // Compress image
      if (autoCompress) {
        const compressed = await compressImage(file, compressionOptions);
        
        // Only use compressed version if it's actually smaller
        if (compressed.size < file.size) {
          result.compressed = compressed;
        }
      }

      // Convert to WebP if supported and enabled
      if (autoWebP && webPSupported) {
        const webp = await convertToWebP(file, compressionOptions.quality || 0.85);
        
        // Only use WebP if it's smaller than the compressed version
        const compareSize = result.compressed?.size || file.size;
        if (webp.size < compareSize) {
          result.webp = webp;
        }
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to optimize image');
      setError(error);
      throw error;
    } finally {
      setIsCompressing(false);
    }
  }, [autoCompress, autoWebP, webPSupported, compressionOptions]);

  /**
   * Optimise plusieurs images
   */
  const optimizeImages = useCallback(async (
    files: File[]
  ): Promise<Array<{ original: File; compressed?: Blob; webp?: Blob }>> => {
    setIsCompressing(true);
    setError(null);

    try {
      const results = await Promise.all(
        files.map(file => optimizeImage(file))
      );
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to optimize images');
      setError(error);
      throw error;
    } finally {
      setIsCompressing(false);
    }
  }, [optimizeImage]);

  /**
   * Crée une URL pour un blob optimisé
   */
  const createOptimizedUrl = useCallback((blob: Blob): string => {
    return URL.createObjectURL(blob);
  }, []);

  return {
    optimizeImage,
    optimizeImages,
    createOptimizedUrl,
    isCompressing,
    webPSupported,
    error
  };
};
