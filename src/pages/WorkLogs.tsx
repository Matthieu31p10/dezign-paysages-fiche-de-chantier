
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useApp } from '@/context/AppContext';
import { WorkLog } from '@/types/models';
import { formatDate } from '@/utils/helpers';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Search, 
  Eye,
  Calendar,
} from 'lucide-react';

const WorkLogs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { workLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkLogs, setFilteredWorkLogs] = useState<WorkLog[]>([]);
  
  // Pagination
  // Fix the arithmetic operation error
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
      
      <Card>
        <CardHeader>
          <CardTitle>Rechercher des fiches de suivi</CardTitle>
          <CardDescription>
            Filtrer les fiches de suivi par nom de chantier ou notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort('date')}>
                  Date
                  {sortColumn === 'date' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('projectId')}>
                  Chantier
                  {sortColumn === 'projectId' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('duration')}>
                  Durée
                  {sortColumn === 'duration' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('personnel')}>
                  Personnel
                  {sortColumn === 'personnel' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWorkLogs.map(workLog => (
              <TableRow key={workLog.id}>
                <TableCell className="font-medium">{formatDate(workLog.date)}</TableCell>
                <TableCell>{workLog.projectId}</TableCell>
                <TableCell>{workLog.duration} heures</TableCell>
                <TableCell>
                  {workLog.personnel.map((person, index) => (
                    <div key={index}>{person}</div>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/worklogs/${workLog.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {currentWorkLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucune fiche de suivi trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredWorkLogs.length > 0 && (
        <div className="flex items-center justify-between px-4">
          <div className="space-x-2">
            <Label htmlFor="perPage">Fiches par page</Label>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                searchParams.set('perPage', value);
                searchParams.set('page', '1'); // Reset to first page
                setSearchParams(searchParams);
              }}
            >
              <SelectTrigger id="perPage">
                <SelectValue placeholder="Fiches par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                onClick={(e) => {
                  if (currentPage > 1) {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  } else {
                    e.preventDefault();
                  }
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
              <PaginationNext
                href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
                onClick={(e) => {
                  if (currentPage < totalPages) {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  } else {
                    e.preventDefault();
                  }
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default WorkLogs;
