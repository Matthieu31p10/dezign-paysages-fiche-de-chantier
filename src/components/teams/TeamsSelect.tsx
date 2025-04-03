
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface TeamsSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TeamsSelect = ({ value, onValueChange }: TeamsSelectProps) => {
  const { teams, addTeam } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  
  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = addTeam({ name: newTeamName.trim() });
      onValueChange(newTeam.id);
      setNewTeamName('');
      setIsDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={value}
          onValueChange={onValueChange}
          className="flex-1"
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
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
          </SelectContent>
        </Select>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle équipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input 
                  id="team-name" 
                  value={newTeamName} 
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Nom de l'équipe"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                type="button"
              >
                Annuler
              </Button>
              <Button onClick={handleAddTeam} type="button">
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
