
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Personnel } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { UserPlus, Users, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PersonnelDialogProps {
  selectedPersonnel: string[];
  onChange: (personnel: string[]) => void;
}

const PersonnelDialog: React.FC<PersonnelDialogProps> = ({ selectedPersonnel, onChange }) => {
  const { settings, updateSettings } = useApp();
  const [open, setOpen] = useState(false);
  const [personnelList, setPersonnelList] = useState<Personnel[]>(settings.personnel || []);
  const [newPersonnelName, setNewPersonnelName] = useState('');
  const [newPersonnelPosition, setNewPersonnelPosition] = useState('');
  const [personToDelete, setPersonToDelete] = useState<Personnel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Synchronize with settings when they change
  useEffect(() => {
    setPersonnelList(settings.personnel || []);
  }, [settings.personnel]);
  
  const handleSave = () => {
    // Save selected personnel to form
    const selected = personnelList
      .filter(person => person.active)
      .map(person => person.name);
    
    onChange(selected);
    
    // Save personnel list to settings
    updateSettings({
      ...settings,
      personnel: personnelList,
    });
    
    setOpen(false);
  };
  
  const handleAddPersonnel = () => {
    if (!newPersonnelName.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    
    // Check if personnel already exists
    const exists = personnelList.some(
      person => person.name.toLowerCase() === newPersonnelName.toLowerCase()
    );
    
    if (exists) {
      toast.error("Cette personne existe déjà");
      return;
    }
    
    const newPerson: Personnel = {
      id: crypto.randomUUID(),
      name: newPersonnelName.trim(),
      position: newPersonnelPosition.trim() || undefined,
      active: true, // New person is selected by default
    };
    
    setPersonnelList([...personnelList, newPerson]);
    setNewPersonnelName('');
    setNewPersonnelPosition('');
    
    toast.success("Personnel ajouté");
  };
  
  const togglePersonnel = (id: string) => {
    setPersonnelList(
      personnelList.map(person => 
        person.id === id ? { ...person, active: !person.active } : person
      )
    );
  };

  const confirmDelete = (person: Personnel) => {
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  };

  const handleDeletePersonnel = () => {
    if (!personToDelete) return;

    // Vérifier si la personne est actuellement sélectionnée dans le formulaire
    const isSelected = selectedPersonnel.includes(personToDelete.name);
    
    // Filtrer la personne de la liste
    const updatedList = personnelList.filter(person => person.id !== personToDelete.id);
    setPersonnelList(updatedList);
    
    // Mettre à jour les paramètres
    updateSettings({
      ...settings,
      personnel: updatedList,
    });

    // Si la personne était sélectionnée, mettre à jour la sélection
    if (isSelected) {
      const updatedSelection = selectedPersonnel.filter(name => name !== personToDelete.name);
      onChange(updatedSelection);
    }
    
    setDeleteDialogOpen(false);
    setPersonToDelete(null);
    toast.success("Personnel supprimé");
  };
  
  // When opening the dialog, mark selected personnel as active
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const updatedList = personnelList.map(person => ({
        ...person,
        active: selectedPersonnel.includes(person.name)
      }));
      setPersonnelList(updatedList);
    }
    setOpen(isOpen);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>
              {selectedPersonnel.length > 0
                ? `${selectedPersonnel.length} personne(s) sélectionnée(s)`
                : "Sélectionner le personnel"}
            </span>
            <Users className="h-4 w-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personnel présent</DialogTitle>
            <DialogDescription>
              Sélectionnez le personnel présent sur le chantier
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Personnel disponible</h3>
              {personnelList.length > 0 ? (
                <div className="space-y-2">
                  {personnelList.map(person => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`person-${person.id}`} 
                        checked={person.active}
                        onCheckedChange={() => togglePersonnel(person.id)}
                      />
                      <Label htmlFor={`person-${person.id}`} className="flex-1">
                        {person.name}
                        {person.position && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({person.position})
                          </span>
                        )}
                      </Label>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => confirmDelete(person)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer {person.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun personnel disponible. Ajoutez-en ci-dessous.
                </p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Ajouter du personnel</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={newPersonnelName} 
                    onChange={e => setNewPersonnelName(e.target.value)}
                    placeholder="Nom du salarié"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Poste (optionnel)</Label>
                  <Input 
                    id="position" 
                    value={newPersonnelPosition} 
                    onChange={e => setNewPersonnelPosition(e.target.value)}
                    placeholder="Poste ou fonction"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddPersonnel}
                  size="sm"
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSave}>
              Confirmer la sélection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertCircle className="h-5 w-5" />
                <span>Êtes-vous sûr de vouloir supprimer ce membre du personnel ?</span>
              </div>
              <p>
                <strong>{personToDelete?.name}</strong>
                {personToDelete?.position && <span> ({personToDelete.position})</span>}
              </p>
              <p>Cette action est irréversible.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePersonnel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PersonnelDialog;
