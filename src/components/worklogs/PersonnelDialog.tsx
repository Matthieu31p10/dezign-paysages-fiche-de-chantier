
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Personnel } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

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
  );
};

export default PersonnelDialog;
