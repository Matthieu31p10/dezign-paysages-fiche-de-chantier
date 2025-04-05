
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { WorkLog } from '@/types/models';
import SearchBar from '@/components/worklogs/list/SearchBar';
import WorkLogsTable from '@/components/worklogs/list/WorkLogsTable';
import PaginationControls from '@/components/worklogs/list/PaginationControls';

const WorkLogs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { workLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkLogs, setFilteredWorkLogs] = useState<WorkLog[]>([]);
  
  // Pagination
  const currentPage = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('perPage') || '10');
  const totalPages = Math.ceil(filteredWorkLogs.length / perPage);
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    // Apply search filter
    const searchedWorkLogs = workLogs.filter(log => {
      const projectName = log.projectId ? log.projectId.toLowerCase() : '';
      const notes = log.notes ? log.notes.toLowerCase() : '';
      const searchTerm = searchQuery.toLowerCase();
      
      return projectName.includes(searchTerm) || notes.includes(searchTerm);
    });
    
    // Apply sorting
    const sortedWorkLogs = [...searchedWorkLogs].sort((a, b) => {
      const aValue = (a[sortColumn as keyof WorkLog] || '').toString().toLowerCase();
      const bValue = (b[sortColumn as keyof WorkLog] || '').toString().toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredWorkLogs(sortedWorkLogs);
  }, [workLogs, searchQuery, sortColumn, sortDirection]);
  
  useEffect(() => {
    // Update URL when search query changes
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  }, [searchQuery, setSearchParams, searchParams]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      // Toggle direction if the same column is clicked again
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default direction to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handlePageChange = (page: number) => {
    searchParams.set('page', String(page));
    setSearchParams(searchParams);
  };
  
  const handlePerPageChange = (value: string) => {
    searchParams.set('perPage', value);
    searchParams.set('page', '1'); // Reset to first page
    setSearchParams(searchParams);
  };
  
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentWorkLogs = filteredWorkLogs.slice(startIndex, endIndex);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Fiches de suivi</h2>
          <p className="text-muted-foreground">
            Suivez l'activité de votre entreprise au quotidien.
          </p>
        </div>
        <Button onClick={() => navigate('/worklogs/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une fiche
        </Button>
      </div>
      
      <SearchBar 
        searchQuery={searchQuery} 
        handleSearchChange={handleSearchChange} 
      />
      
      <WorkLogsTable 
        currentWorkLogs={currentWorkLogs}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
      
      {filteredWorkLogs.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default WorkLogs;
