import React from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  rootMargin?: string;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 0.5,
  rootMargin = '100px',
  loader,
  endMessage,
  className = '',
}: InfiniteScrollProps) {
  const { loadMoreRef } = useInfiniteScroll(onLoadMore, {
    threshold,
    rootMargin,
    enabled: hasMore && !loading,
  });

  const defaultLoader = (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-4 text-muted-foreground">
      Plus de contenu à charger
    </div>
  );

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={loadMoreRef}>
          {loading ? (loader || defaultLoader) : null}
        </div>
      )}
      {!hasMore && (endMessage || defaultEndMessage)}
    </div>
  );
}
