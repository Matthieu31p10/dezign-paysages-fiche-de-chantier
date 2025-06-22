
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, teamIndex) => (
        <Card key={teamIndex} className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-white border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex justify-end gap-2 mb-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, projectIndex) => (
                <Card key={projectIndex} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-60" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid gap-3">
                      {Array.from({ length: 2 }).map((_, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-5 w-24 rounded-full" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
