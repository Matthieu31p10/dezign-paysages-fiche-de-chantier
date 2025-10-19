/**
 * Utilitaires pour l'optimisation d'images
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Compresse une image en utilisant un canvas
 */
export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convertit une image en WebP
 */
export const convertToWebP = async (
  file: File,
  quality: number = 0.85
): Promise<Blob> => {
  return compressImage(file, { format: 'webp', quality });
};

/**
 * Génère un placeholder blur pour une image
 */
export const generateBlurPlaceholder = async (
  file: File,
  width: number = 10
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const aspectRatio = img.height / img.width;
        
        canvas.width = width;
        canvas.height = width * aspectRatio;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'low';
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.1));
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Précharge une liste d'images
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
          img.src = url;
        })
    )
  );
};

/**
 * Vérifie si le navigateur supporte WebP
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    const img = new Image();
    
    img.onload = () => {
      resolve(img.width === 1);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    img.src = webP;
  });
};

/**
 * Obtient les dimensions optimales pour une image
 */
export const getOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  };
};

/**
 * Estime la taille du fichier après compression
 */
export const estimateCompressedSize = (
  originalSize: number,
  quality: number,
  format: 'jpeg' | 'webp' | 'png' = 'jpeg'
): number => {
  // Estimations approximatives basées sur des tests
  const compressionRatios = {
    jpeg: quality,
    webp: quality * 0.75, // WebP est généralement ~25% plus efficace
    png: 0.9 // PNG avec compression minimale
  };

  return Math.round(originalSize * compressionRatios[format]);
};
