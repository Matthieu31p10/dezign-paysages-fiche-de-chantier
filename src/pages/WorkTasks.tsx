
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { WorkTask } from '@/types/workTask';
import { toast } from 'sonner';
import Header from '@/components/worktasks/list/Header';
import SearchBar from '@/components/worktasks/list/SearchBar';
import WorkTasksTable from '@/components/worktasks/list/WorkTasksTable';
import PaginationControls from '@/components/worktasks/list/PaginationControls';

const WorkTasks = () => {
  const [searchParams] = useSearchParams();
  const { workTasks, deleteWorkTask } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorkTasks, setFilteredWorkTasks] = useState<WorkTask[]>([]);
  
  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  
  // Fix the arithmetic operation error
  const currentPage = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('perPage') || '10');
  
  useEffect(() => {
    // Apply search filter
    const filtered = workTasks.filter(task =>
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkTasks(filtered);
    setTotalItems(filtered.length);
  }, [workTasks, searchTerm]);
  
  // Paginated items
  const paginatedWorkTasks = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredWorkTasks.slice(startIndex, endIndex);
  };
  
  const handleDelete = (id: string) => {
    deleteWorkTask(id);
    toast.success("Fiche de travaux supprimée avec succès");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Header />
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des fiches de travaux</CardTitle>
          <CardDescription>
            Visualisez, modifiez et gérez les fiches de travaux existantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <WorkTasksTable workTasks={paginatedWorkTasks()} onDelete={handleDelete} />
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {totalItems > 0 && (
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={Math.ceil(totalItems / perPage)} 
          perPage={perPage}
        />
      )}
    </div>
  );
};

export default WorkTasks;
