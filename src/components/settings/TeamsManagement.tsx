
import React, { useState } from 'react';
import { useTeams } from '@/context/TeamsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

const TeamsManagement = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  
  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Le nom de l\'équipe ne peut pas être vide');
      return;
    }
    
    addTeam({ name: newTeamName.trim() });
    setNewTeamName('');
  };
  
  const startEditing = (teamId: string, name: string) => {
    setEditingTeam(teamId);
    setEditName(name);
  };
  
  const cancelEditing = () => {
    setEditingTeam(null);
    setEditName('');
  };
  
  const saveTeamEdit = (teamId: string) => {
    if (!editName.trim()) {
      toast.error('Le nom de l\'équipe ne peut pas être vide');
      return;
    }
    
    const team = teams.find(t => t.id === teamId);
    if (team) {
      updateTeam({ ...team, name: editName.trim() });
      cancelEditing();
    }
  };
  
  const confirmDelete = (teamId: string) => {
    setDeletingTeam(teamId);
  };
  
  const handleDeleteTeam = () => {
    if (deletingTeam) {
      deleteTeam(deletingTeam);
      setDeletingTeam(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Input
            placeholder="Nom de la nouvelle équipe"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="border-green-300 focus-visible:ring-green-500"
          />
        </div>
        <Button 
          onClick={handleAddTeam}
          className="bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
      
      <Card className="border-green-200">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="text-green-800">Nom de l'équipe</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                  Aucune équipe n'a été créée
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    {editingTeam === team.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-green-300 focus-visible:ring-green-500"
                      />
                    ) : (
                      team.name
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingTeam === team.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => saveTeamEdit(team.id)}
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={cancelEditing}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditing(team.id, team.name)}
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDelete(team.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      
      <AlertDialog open={!!deletingTeam} onOpenChange={() => setDeletingTeam(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette équipe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les fiches de suivi associées à cette équipe ne seront pas supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamsManagement;
