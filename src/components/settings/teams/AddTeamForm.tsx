
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTeams } from '@/context/TeamsContext';
import TeamColorPicker from './TeamColorPicker';

const AddTeamForm: React.FC = () => {
  const { addTeam } = useTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#10B981');
  
  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Le nom de l\'équipe ne peut pas être vide');
      return;
    }
    
    addTeam({ name: newTeamName.trim(), color: newTeamColor });
    setNewTeamName('');
    setNewTeamColor('#10B981');
  };

  return (
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
        <TeamColorPicker
          selectedColor={newTeamColor}
          onColorSelect={setNewTeamColor}
        />
        <Button 
          onClick={handleAddTeam}
          className="bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default AddTeamForm;
