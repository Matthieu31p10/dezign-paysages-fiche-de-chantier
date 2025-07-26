
import React, { useState } from 'react';
import { usePersonnelManagement } from '@/hooks/usePersonnelManagement';
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
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit2, Trash2, Save, X, User } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

const PersonnelManagement = () => {
  const { personnel, addPersonnel, updatePersonnel, deletePersonnel, togglePersonnelActive, loading } = usePersonnelManagement();
  
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleAddPerson = () => {
    if (!newName.trim()) {
      toast.error('Le nom ne peut pas être vide');
      return;
    }
    
    addPersonnel(newName.trim(), newPosition.trim());
    setNewName('');
    setNewPosition('');
  };
  
  const startEditing = (id: string, name: string, position: string) => {
    setEditingId(id);
    setEditName(name);
    setEditPosition(position);
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditPosition('');
  };
  
  const savePersonEdit = (id: string) => {
    if (!editName.trim()) {
      toast.error('Le nom ne peut pas être vide');
      return;
    }
    
    const person = personnel.find(p => p.id === id);
    if (person) {
      updatePersonnel({ 
        ...person, 
        name: editName.trim(), 
        position: editPosition.trim()
      });
      cancelEditing();
    }
  };
  
  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };
  
  const handleDeletePerson = () => {
    if (deletingId) {
      deletePersonnel(deletingId);
      setDeletingId(null);
    }
  };
  
  const handleToggleActive = (id: string, isActive: boolean) => {
    togglePersonnelActive(id, isActive);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <Input
          placeholder="Nom"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border-green-300 focus-visible:ring-green-500"
        />
        <Input
          placeholder="Fonction (optionnel)"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          className="border-green-300 focus-visible:ring-green-500"
        />
        <Button 
          onClick={handleAddPerson}
          className="sm:col-span-2 bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une personne
        </Button>
      </div>
      
      <Card className="border-green-200">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="text-green-800">Nom</TableHead>
              <TableHead className="text-green-800">Fonction</TableHead>
              <TableHead className="text-green-800">Actif</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : personnel.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Aucun personnel n'a été ajouté
                </TableCell>
              </TableRow>
            ) : (
              personnel.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    {editingId === person.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-green-300 focus-visible:ring-green-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        {person.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === person.id ? (
                      <Input
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                        className="border-green-300 focus-visible:ring-green-500"
                      />
                    ) : (
                      person.position || "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${person.id}`}
                        checked={person.active}
                        onCheckedChange={(checked) => handleToggleActive(person.id, checked)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <Label htmlFor={`active-${person.id}`} className="text-sm">
                        {person.active ? 'Oui' : 'Non'}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingId === person.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => savePersonEdit(person.id)}
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
                            onClick={() => startEditing(person.id, person.name, person.position || '')}
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDelete(person.id)}
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
      
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette personne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les fiches de suivi associées à cette personne ne seront pas supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePerson} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PersonnelManagement;
