
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check, Plus, User, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';

interface PersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}

const PersonnelDialog: React.FC<PersonnelDialogProps> = ({
  open,
  onOpenChange,
  selected,
  onSelectionChange,
}) => {
  const { settings } = useApp();
  const [newPersonName, setNewPersonName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const personnel = settings.personnel || [];
  const activePersonnel = personnel.filter(p => p.active);

  const filteredPersonnel = activePersonnel.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePerson = (name: string) => {
    if (selected.includes(name)) {
      onSelectionChange(selected.filter(n => n !== name));
    } else {
      onSelectionChange([...selected, name]);
    }
  };

  const handleAddNew = () => {
    if (newPersonName.trim()) {
      onSelectionChange([...selected, newPersonName.trim()]);
      setNewPersonName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personnel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selected.map(name => (
              <Badge key={name} className="flex items-center gap-1">
                {name}
                <button
                  type="button"
                  onClick={() => handleTogglePerson(name)}
                  className="ml-1 rounded-full hover:bg-primary-dark"
                >
                  <UserX className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="max-h-56 overflow-y-auto pr-2 space-y-1">
            {filteredPersonnel.map(person => (
              <Button
                key={person.id}
                type="button"
                variant={selected.includes(person.name) ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => handleTogglePerson(person.name)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{person.name}</span>
                  {selected.includes(person.name) && <Check className="h-4 w-4 ml-2" />}
                </div>
              </Button>
            ))}

            {filteredPersonnel.length === 0 && searchQuery && (
              <div className="text-center p-2 text-muted-foreground">
                Aucun résultat pour "{searchQuery}"
              </div>
            )}
          </div>

          <div className="flex mt-4">
            <Input
              placeholder="Ajouter une nouvelle personne"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddNew}
              disabled={!newPersonName.trim()}
              className="ml-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Terminé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonnelDialog;
