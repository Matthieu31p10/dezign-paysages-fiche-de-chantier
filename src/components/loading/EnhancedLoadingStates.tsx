import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Enhanced Card Skeleton with mobile optimization
export const CardSkeleton: React.FC<{ 
  showHeader?: boolean; 
  lines?: number;
  className?: string;
}> = ({ showHeader = true, lines = 3, className }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn("animate-fade-in", className)}>
      {showHeader && (
        <CardHeader className={isMobile ? "p-4" : "p-6"}>
          <Skeleton className={`h-6 ${isMobile ? "w-32" : "w-40"}`} />
          <Skeleton className={`h-4 ${isMobile ? "w-24" : "w-32"} mt-2`} />
        </CardHeader>
      )}
      <CardContent className={isMobile ? "p-4" : "p-6"}>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Table Skeleton with responsive design
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b last:border-b-0">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// List Skeleton with mobile optimization
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={`flex items-center space-x-4 ${isMobile ? "p-3" : "p-4"} border rounded-lg`}>
          <Skeleton className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} rounded-full`} />
          <div className="space-y-2 flex-1">
            <Skeleton className={`h-4 ${isMobile ? "w-32" : "w-40"}`} />
            <Skeleton className={`h-3 ${isMobile ? "w-24" : "w-32"}`} />
          </div>
          <Skeleton className={`h-8 ${isMobile ? "w-16" : "w-20"}`} />
        </div>
      ))}
    </div>
  );
};

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={isMobile ? "p-4" : "p-6"}>
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
};

// Page Loading with branding
export const PageLoadingSkeleton: React.FC<{ 
  title?: string;
  showCards?: boolean;
}> = ({ title = "Chargement", showCards = true }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className={`h-8 ${isMobile ? "w-48" : "w-64"}`} />
        <Skeleton className={`h-4 ${isMobile ? "w-32" : "w-48"}`} />
      </div>
      
      {/* Stats Cards */}
      {showCards && (
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}>
          {Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
            <Card key={i} className={isMobile ? "p-4" : "p-6"}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Main Content */}
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
        <div className={isMobile ? "col-span-1" : "col-span-2"}>
          <CardSkeleton lines={6} />
        </div>
        <div className="col-span-1">
          <CardSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
};

// Loading with Progress
export const ProgressLoadingSkeleton: React.FC<{ 
  progress?: number;
  message?: string;
}> = ({ progress = 0, message = "Chargement en cours..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};