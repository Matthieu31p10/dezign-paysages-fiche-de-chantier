import React, { Suspense, Component, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <div className="text-destructive mb-2">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Failed to load component</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || 'An error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
  center?: boolean;
  className?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const DefaultLoadingFallback = ({ 
  minHeight = '200px', 
  center = true,
  className 
}: { 
  minHeight?: string; 
  center?: boolean;
  className?: string;
}) => (
  <div 
    className={cn(
      "flex items-center justify-center w-full",
      center && "min-h-[200px]",
      className
    )}
    style={{ minHeight: center ? minHeight : undefined }}
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * LazyComponent - Wraps lazy-loaded components with Suspense and ErrorBoundary
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  minHeight = '200px',
  center = true,
  className,
  onError
}) => {
  const loadingFallback = fallback || (
    <DefaultLoadingFallback minHeight={minHeight} center={center} className={className} />
  );

  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Inline loading spinner for smaller components
 */
export const InlineLoader: React.FC<{ className?: string }> = ({ className }) => (
  <span className={cn("inline-flex items-center justify-center", className)}>
    <Loader2 className="h-4 w-4 animate-spin text-primary" />
  </span>
);

/**
 * Skeleton loader for lazy content
 */
export const SkeletonLoader: React.FC<{ 
  className?: string;
  lines?: number;
}> = ({ className, lines = 3 }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-muted rounded animate-pulse"
        style={{ width: `${100 - (i * 10)}%` }}
      />
    ))}
  </div>
);
