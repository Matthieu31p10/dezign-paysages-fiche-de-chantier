import React, { useState, useEffect } from 'react';
import { useLazyImage } from '@/hooks/useLazyLoading';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  webpSrc?: string;
  fallback?: string;
  blur?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  containerClassName?: string;
}

/**
 * Composant d'image optimisé avec :
 * - Lazy loading automatique
 * - Support WebP avec fallback
 * - Effet de blur pendant le chargement
 * - Gestion d'erreurs avec fallback
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  webpSrc,
  fallback,
  blur = true,
  priority = false,
  onLoad,
  onError,
  className,
  containerClassName,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(priority ? src : '');
  const [hasError, setHasError] = useState(false);
  const { elementRef, loaded, error, shouldLoad } = useLazyImage(src, {
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Load image when it should be visible or priority is set
  useEffect(() => {
    if (priority || shouldLoad) {
      setImgSrc(src);
    }
  }, [shouldLoad, src, priority]);

  // Handle error with fallback
  useEffect(() => {
    if (error) {
      setHasError(true);
      if (fallback) {
        setImgSrc(fallback);
      }
      onError?.();
    }
  }, [error, fallback, onError]);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  // Loading placeholder
  if (!imgSrc && !priority) {
    return (
      <div
        ref={elementRef}
        className={cn(
          'flex items-center justify-center bg-muted',
          containerClassName,
          className
        )}
        {...props}
      >
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  // Error state with no fallback
  if (hasError && !fallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          containerClassName,
          className
        )}
        {...props}
      >
        <ImageIcon className="h-8 w-8 text-destructive/50" />
      </div>
    );
  }

  return (
    <div ref={elementRef} className={cn('relative overflow-hidden', containerClassName)}>
      {/* WebP avec fallback */}
      {webpSrc && !hasError ? (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <source srcSet={imgSrc} type="image/jpeg" />
          <img
            src={imgSrc}
            alt={alt}
            className={cn(
              'transition-all duration-300',
              blur && !loaded && 'blur-sm scale-105',
              loaded && 'blur-0 scale-100',
              className
            )}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          className={cn(
            'transition-all duration-300',
            blur && !loaded && 'blur-sm scale-105',
            loaded && 'blur-0 scale-100',
            className
          )}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Loading overlay */}
      {blur && !loaded && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      )}
    </div>
  );
};

OptimizedImage.displayName = 'OptimizedImage';
