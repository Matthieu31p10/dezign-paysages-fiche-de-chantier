
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TeamsSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TeamsSelect = ({ value, onValueChange }: TeamsSelectProps) => {
  const { teams, addTeam } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  
  const handleAddTeam = async () => {
    if (newTeamName.trim() === '') return;
    
    try {
      const newTeam = await addTeam({ name: newTeamName.trim() });
      onValueChange(newTeam.id);
      setNewTeamName('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };
  
  return (
    <>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une équipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {teams.length > 0 ? (
              teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-teams-available" disabled>
                Aucune équipe disponible
              </SelectItem>
            )}
          </SelectGroup>
          <div className="px-2 py-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal"
              onClick={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Ajouter une équipe
            </Button>
          </div>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle équipe</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="team-name">Nom de l'équipe</Label>
            <Input
              id="team-name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Nom de l'équipe"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddTeam}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
