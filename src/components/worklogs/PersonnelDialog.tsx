
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Personnel } from '@/types/models';
import { useSettings } from '@/context/SettingsContext';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PersonnelDialogProps {
  selectedPersonnel: string[];
  onChange: (personnel: string[]) => void;
}

const PersonnelDialog: React.FC<PersonnelDialogProps> = ({ selectedPersonnel, onChange }) => {
  const { getPersonnel, addPersonnel } = useSettings();
  const [open, setOpen] = useState(false);
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [newPersonnelName, setNewPersonnelName] = useState('');
  const [newPersonnelPosition, setNewPersonnelPosition] = useState('');
  const [localSelectedPersonnel, setLocalSelectedPersonnel] = useState<string[]>(selectedPersonnel);
  
  // Charger le personnel depuis les paramètres
  useEffect(() => {
    const personnel = getPersonnel();
    setPersonnelList(personnel);
  }, [getPersonnel]); // Keep dependency but memoize getPersonnel in context
  
  // Synchroniser avec les props
  useEffect(() => {
    setLocalSelectedPersonnel(selectedPersonnel);
  }, [selectedPersonnel]);
  
  const handleSave = () => {
    onChange(localSelectedPersonnel);
    setOpen(false);
  };
  
  const handleAddPersonnel = async () => {
    if (!newPersonnelName.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    
    // Vérifier si le personnel existe déjà
    const exists = personnelList.some(
      person => person.name.toLowerCase() === newPersonnelName.toLowerCase()
    );
    
    if (exists) {
      toast.error("Cette personne existe déjà");
      return;
    }
    
    try {
      await addPersonnel(newPersonnelName.trim(), newPersonnelPosition.trim());
      
      // Recharger la liste après ajout
      const updatedPersonnel = getPersonnel();
      setPersonnelList(updatedPersonnel);
      
      // Ajouter automatiquement la nouvelle personne à la sélection
      setLocalSelectedPersonnel(prev => [...prev, newPersonnelName.trim()]);
      
      setNewPersonnelName('');
      setNewPersonnelPosition('');
      
      toast.success("Personnel ajouté et sélectionné");
    } catch (error) {
      console.error('Erreur lors de l\'ajout du personnel:', error);
    }
  };
  
  const togglePersonnel = (name: string) => {
    setLocalSelectedPersonnel(prev => {
      if (prev.includes(name)) {
        return prev.filter(p => p !== name);
      } else {
        return [...prev, name];
      }
    });
  };
  
  // Filtrer seulement le personnel actif
  const activePersonnel = personnelList.filter(person => person.active);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            {activePersonnel.length > 0 ? (
              <div className="space-y-2">
                {activePersonnel.map(person => (
                  <div key={person.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`person-${person.id}`} 
                      checked={localSelectedPersonnel.includes(person.name)}
                      onCheckedChange={() => togglePersonnel(person.name)}
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
                Aucun personnel actif disponible. Ajoutez-en ci-dessous.
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
