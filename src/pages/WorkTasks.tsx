
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
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useApp } from '@/context/AppContext';
import { WorkTask } from '@/types/workTask';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const WorkTasks = () => {
  const navigate = useNavigate();
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Fiches de travaux</h1>
          <p className="text-muted-foreground">
            Suivez et gérez efficacement les fiches de travaux.
          </p>
        </div>
        <Button onClick={() => navigate('/worktasks/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une fiche
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des fiches de travaux</CardTitle>
          <CardDescription>
            Visualisez, modifiez et gérez les fiches de travaux existantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Rechercher un chantier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Chantier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorkTasks().map((workTask) => (
                  <TableRow key={workTask.id}>
                    <TableCell className="font-medium">{workTask.projectName}</TableCell>
                    <TableCell>{formatDate(workTask.date)}</TableCell>
                    <TableCell>{workTask.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/worktasks/${workTask.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/worktasks/edit/${workTask.id}`)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. La fiche de travaux sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(workTask.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedWorkTasks().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Aucune fiche de travaux trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/worktasks?page=${Math.max(1, currentPage - 1)}&perPage=${perPage}`}
              />
            </PaginationItem>
            
            {/* Display page numbers */}
            {Array.from({ length: Math.ceil(totalItems / perPage) }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/worktasks?page=${page}&perPage=${perPage}`}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                href={`/worktasks?page=${Math.min(Math.ceil(totalItems / perPage), currentPage + 1)}&perPage=${perPage}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default WorkTasks;
