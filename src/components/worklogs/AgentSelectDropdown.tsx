
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface AgentSelectDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  savedAgents: string[];
  onAddNewAgent: (agent: string) => void;
}

const AgentSelectDropdown: React.FC<AgentSelectDropdownProps> = ({
  value,
  onChange,
  savedAgents,
  onAddNewAgent
}) => {
  const [newAgent, setNewAgent] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const handleAddAgent = () => {
    // Vérifier si le champ est vide
    if (!selectedAgent && !newAgent) {
      toast.error("Veuillez sélectionner ou saisir un agent");
      return;
    }

    const agentToAdd = selectedAgent || newAgent.trim();
    
    // Vérifier si l'agent est déjà dans la liste
    if (value.includes(agentToAdd)) {
      toast.error("Cet agent est déjà ajouté à la liste");
      return;
    }

    // Ajouter l'agent à la liste
    onChange([...value, agentToAdd]);
    
    // Si c'est un nouvel agent, l'ajouter à la liste globale
    if (newAgent && !savedAgents.includes(newAgent)) {
      onAddNewAgent(newAgent);
    }
    
    // Réinitialiser les champs
    setNewAgent('');
    setSelectedAgent('');
  };

  const handleRemoveAgent = (agent: string) => {
    onChange(value.filter(a => a !== agent));
  };

  return (
    <div className="space-y-3">
      <Label>Personnel présent</Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-2">
        <div className="sm:col-span-3">
          <Select
            value={selectedAgent}
            onValueChange={(value) => setSelectedAgent(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un agent" />
            </SelectTrigger>
            <SelectContent>
              {savedAgents
                .filter(agent => !value.includes(agent))
                .map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="sm:col-span-3">
          <Input
            type="text"
            placeholder="Nouvel agent"
            value={newAgent}
            onChange={(e) => setNewAgent(e.target.value)}
          />
        </div>
        
        <div className="sm:col-span-2">
          <Button 
            type="button" 
            onClick={handleAddAgent}
            className="w-full h-10"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          <Label>Agents sélectionnés:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((agent) => (
              <div 
                key={agent}
                className="flex items-center bg-slate-100 px-2 py-1 rounded-md"
              >
                <User className="h-4 w-4 mr-1 text-slate-500" />
                <span>{agent}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1"
                  onClick={() => handleRemoveAgent(agent)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSelectDropdown;
