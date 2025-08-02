import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar } from 'lucide-react';
import { PassageCard } from './PassageCard';
import { PassageCardCompact } from './PassageCardCompact';
import { PassageTable } from './PassageTable';
import { PassageViewControls } from './PassageViewControls';
import { WorkLog } from '@/types/models';

interface PassageListProps {
  sortedPassages: WorkLog[];
  selectedProject: string;
  selectedTeam: string;
  getProjectName: (projectId: string) => string;
}

export const PassageList: React.FC<PassageListProps> = ({
  sortedPassages,
  selectedProject,
  selectedTeam,
  getProjectName
}) => {
  // Load preferences from localStorage
  const [viewMode, setViewMode] = useState<'compact' | 'detailed' | 'table'>(() => {
    return (localStorage.getItem('passageViewMode') as 'compact' | 'detailed' | 'table') || 'detailed';
  });
  const [sortBy, setSortBy] = useState<'date' | 'project' | 'duration' | 'team' | 'daysSince'>(() => {
    return (localStorage.getItem('passageSortBy') as 'date' | 'project' | 'duration' | 'team' | 'daysSince') || 'date';
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return (localStorage.getItem('passageSortOrder') as 'asc' | 'desc') || 'desc';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'table' ? 15 : 10;

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('passageViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('passageSortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('passageSortOrder', sortOrder);
  }, [sortOrder]);

  // Sort passages
  const sortedData = useMemo(() => {
    const getDaysSincePassage = (date: string) => {
      const passageDate = new Date(date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - passageDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const sorted = [...sortedPassages].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'project':
          aValue = getProjectName(a.projectId);
          bValue = getProjectName(b.projectId);
          break;
        case 'duration':
          aValue = a.timeTracking?.totalHours || a.duration || 0;
          bValue = b.timeTracking?.totalHours || b.duration || 0;
          break;
        case 'team':
          aValue = a.personnel?.[0] || '';
          bValue = b.personnel?.[0] || '';
          break;
        case 'daysSince':
          aValue = getDaysSincePassage(a.date);
          bValue = getDaysSincePassage(b.date);
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [sortedPassages, sortBy, sortOrder, getProjectName]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortedPassages]);

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5" />
          Historique des passages
        </CardTitle>
        <CardDescription>
          {selectedProject || selectedTeam
            ? `Passages filtrés ${selectedProject ? `pour "${getProjectName(selectedProject)}"` : ''} ${selectedTeam ? `équipe "${selectedTeam}"` : ''}`
            : 'Tous les passages effectués sur l\'ensemble des chantiers'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {selectedProject || selectedTeam
                ? 'Aucun passage trouvé pour ces critères de recherche'
                : 'Aucun passage enregistré'
              }
            </p>
          </div>
        ) : (
          <>
            <PassageViewControls
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              totalResults={sortedData.length}
            />
            
            {viewMode === 'table' ? (
              <PassageTable 
                passages={paginatedData} 
                getProjectName={getProjectName} 
              />
            ) : (
              <div className={viewMode === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-4'}>
                {paginatedData.map((passage) => 
                  viewMode === 'compact' ? (
                    <PassageCardCompact 
                      key={passage.id} 
                      passage={passage} 
                      getProjectName={getProjectName} 
                    />
                  ) : (
                    <PassageCard 
                      key={passage.id} 
                      passage={passage} 
                      getProjectName={getProjectName} 
                    />
                  )
                )}
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};