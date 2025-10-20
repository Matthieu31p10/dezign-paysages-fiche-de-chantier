import React, { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'default' | 'card' | 'inline' | 'skeleton';
  className?: string;
}

const LoadingVariants = {
  default: () => (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
  
  card: () => (
    <Card className="p-8">
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </Card>
  ),
  
  inline: () => (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Loading...</span>
    </span>
  ),
  
  skeleton: () => (
    <div className="space-y-4">
      <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-4 bg-muted rounded animate-pulse w-full" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
    </div>
  )
};

/**
 * SuspenseWrapper - Configurable Suspense boundary with different loading states
 */
export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  variant = 'default',
  className
}) => {
  const loadingFallback = fallback || LoadingVariants[variant]();

  return (
    <Suspense fallback={<div className={className}>{loadingFallback}</div>}>
      {children}
    </Suspense>
  );
};

/**
 * RouteLoader - Specialized loader for route-level code splitting
 */
export const RouteLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex flex-col items-center justify-center min-h-[60vh] w-full", className)}>
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-sm text-muted-foreground">Loading page...</p>
  </div>
);

/**
 * ModalLoader - Loader for lazy-loaded modals/dialogs
 */
export const ModalLoader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * TabLoader - Loader for lazy-loaded tab content
 */
export const TabLoader: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

/**
 * ChartLoader - Skeleton loader for charts/graphs
 */
export const ChartLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-4", className)}>
    <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
    <div className="h-64 bg-muted rounded animate-pulse" />
    <div className="flex gap-4">
      <div className="h-4 bg-muted rounded animate-pulse flex-1" />
      <div className="h-4 bg-muted rounded animate-pulse flex-1" />
      <div className="h-4 bg-muted rounded animate-pulse flex-1" />
    </div>
  </div>
);
