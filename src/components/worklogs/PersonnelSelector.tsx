
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X, Plus, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PersonnelSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PersonnelSelector: React.FC<PersonnelSelectorProps> = ({ value, onChange }) => {
  const { getPersonnelList, addPersonnel } = useApp();
  const [newPersonnel, setNewPersonnel] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  
  const personnelList = getPersonnelList();
  
  const handleSelectChange = (selectedName: string) => {
    setSelectedValue(selectedName);
    if (selectedName && !value.includes(selectedName)) {
      onChange([...value, selectedName]);
      setSelectedValue('');
    }
  };
  
  const handleAddNew = () => {
    if (!newPersonnel.trim()) return;
    
    if (!value.includes(newPersonnel.trim())) {
      const newValue = [...value, newPersonnel.trim()];
      onChange(newValue);
      addPersonnel(newPersonnel.trim());
      setNewPersonnel('');
    }
  };
  
  const handleRemove = (name: string) => {
    onChange(value.filter(item => item !== name));
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="personnel-select">Sélectionner un agent</Label>
          <Select value={selectedValue} onValueChange={handleSelectChange}>
            <SelectTrigger id="personnel-select">
              <SelectValue placeholder="Choisir un agent" />
            </SelectTrigger>
            <SelectContent>
              {personnelList.map(name => (
                <SelectItem 
                  key={name} 
                  value={name}
                  disabled={value.includes(name)}
                >
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="new-personnel">Ajouter un nouvel agent</Label>
          <Input
            id="new-personnel"
            value={newPersonnel}
            onChange={(e) => setNewPersonnel(e.target.value)}
            placeholder="Nom de l'agent"
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={handleAddNew}
          disabled={!newPersonnel.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {value.length > 0 && (
        <div className="pt-2">
          <Label>Agents sélectionnés:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map(name => (
              <Badge key={name} variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {name}
                <button 
                  type="button"
                  onClick={() => handleRemove(name)}
                  className="ml-1 hover:text-destructive focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelSelector;
