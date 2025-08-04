import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProjectSkeletonProps {
  viewMode: 'grid' | 'list';
  count?: number;
}

const ProjectCardSkeleton: React.FC = () => (
  <Card className="group animate-pulse border-2 border-gray-100">
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  </Card>
);

const ProjectListRowSkeleton: React.FC = () => (
  <div className="flex items-center px-4 py-4 border-b border-gray-100 animate-pulse">
    {/* Type */}
    <div className="flex items-center gap-2 w-32">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-6 w-20" />
    </div>

    {/* Nom */}
    <div className="flex-1 min-w-0 px-4">
      <Skeleton className="h-5 w-40" />
    </div>

    {/* Adresse */}
    <div className="hidden md:block flex-1 min-w-0 px-4">
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Passages */}
    <div className="hidden md:block w-24 text-center px-2">
      <Skeleton className="h-6 w-12 mx-auto" />
    </div>

    {/* Heures */}
    <div className="hidden md:block w-24 text-center px-2">
      <Skeleton className="h-6 w-16 mx-auto" />
    </div>

    {/* Actions */}
    <div className="w-32 flex justify-end gap-2">
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

const ProjectSkeleton: React.FC<ProjectSkeletonProps> = ({ 
  viewMode, 
  count = 6 
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }, (_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <Card className="border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-25 border-b p-4">
        <div className="flex items-center animate-pulse">
          <div className="w-32">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex-1 px-4">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="hidden md:block flex-1 px-4">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="hidden md:block w-24 text-center">
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
          <div className="hidden md:block w-24 text-center">
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="w-32 text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        </div>
      </div>

      {/* Rows */}
      <div>
        {Array.from({ length: count }, (_, i) => (
          <ProjectListRowSkeleton key={i} />
        ))}
      </div>
    </Card>
  );
};

export default ProjectSkeleton;