
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

const TEAM_COLORS = [
  '#10B981', // green
  '#3B82F6', // blue  
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#6B7280', // gray
  '#22C55E', // lime
  '#84CC16', // lime green
  '#EAB308', // yellow
  '#F97316', // orange
  '#DC2626', // red dark
  '#BE185D', // pink dark
  '#7C3AED', // violet
  '#2563EB', // blue dark
  '#059669', // emerald
  '#0891B2', // sky
  '#64748B', // slate
  '#78716C', // stone
];

const TeamsManagement = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#10B981');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  
  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Le nom de l\'équipe ne peut pas être vide');
      return;
    }
    
    addTeam({ name: newTeamName.trim(), color: newTeamColor });
    setNewTeamName('');
    setNewTeamColor('#10B981');
  };
  
  const startEditing = (teamId: string, name: string, color: string) => {
    setEditingTeam(teamId);
    setEditName(name);
    setEditColor(color);
  };
  
  const cancelEditing = () => {
    setEditingTeam(null);
    setEditName('');
    setEditColor('');
  };
  
  const saveTeamEdit = (teamId: string) => {
    if (!editName.trim()) {
      toast.error('Le nom de l\'équipe ne peut pas être vide');
      return;
    }
    
    const team = teams.find(t => t.id === teamId);
    if (team) {
      updateTeam({ ...team, name: editName.trim(), color: editColor });
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
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-10 gap-1">
            {TEAM_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                  newTeamColor === color ? 'border-gray-400 ring-2 ring-gray-300' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTeamColor(color)}
              />
            ))}
          </div>
          <Button 
            onClick={handleAddTeam}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <Card className="border-green-200">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="text-green-800">Couleur</TableHead>
              <TableHead className="text-green-800">Nom de l'équipe</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Aucune équipe n'a été créée
                </TableCell>
              </TableRow>
            ) : (
              teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    {editingTeam === team.id ? (
                      <div className="grid grid-cols-10 gap-1">
                        {TEAM_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                              editColor === color ? 'border-gray-400 ring-2 ring-gray-300' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditColor(color)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: team.color }}
                      />
                    )}
                  </TableCell>
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
                            onClick={() => startEditing(team.id, team.name, team.color)}
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
