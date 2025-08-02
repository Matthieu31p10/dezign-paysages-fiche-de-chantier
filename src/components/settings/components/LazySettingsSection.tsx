import React, { Suspense } from 'react';
import { useLazyComponent } from '@/hooks/useLazyLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LazySettingsSectionProps {
  title: string;
  description?: string;
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  props?: Record<string, any>;
}

/**
 * Section de paramètres avec chargement différé pour optimiser les performances
 */
const LazySettingsSection = ({
  title,
  description,
  importFunc,
  fallback,
  className,
  props = {}
}: LazySettingsSectionProps) => {
  const { Component, loading, error, elementRef, isVisible } = useLazyComponent(
    importFunc,
    { threshold: 0.1, rootMargin: '100px' }
  );

  const defaultFallback = (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">
            Erreur de chargement: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={elementRef}>
      {!isVisible || loading ? (
        fallback || defaultFallback
      ) : Component ? (
        <Suspense fallback={fallback || defaultFallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazySettingsSection;

/**
 * HOC pour wrapper un composant de paramètres avec du lazy loading
 */
export const withLazyLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    title: string;
    description?: string;
    fallback?: React.ReactNode;
    className?: string;
  }
) => {
  return React.memo((props: P) => {
    const { elementRef, isVisible } = useLazyComponent(
      () => Promise.resolve({ default: WrappedComponent }),
      { threshold: 0.1, rootMargin: '50px' }
    );

    const defaultFallback = (
      <Card className={options.className}>
        <CardHeader>
          <CardTitle>{options.title}</CardTitle>
          {options.description && (
            <div className="text-sm text-muted-foreground">{options.description}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );

    return (
      <div ref={elementRef}>
        {isVisible ? (
          <Suspense fallback={options.fallback || defaultFallback}>
            <WrappedComponent {...props} />
          </Suspense>
        ) : (
          options.fallback || defaultFallback
        )}
      </div>
    );
  });
};