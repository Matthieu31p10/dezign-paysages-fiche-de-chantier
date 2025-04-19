
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Save } from 'lucide-react';

interface ConsumablesHeaderProps {
  onOpenSaved: () => void;
  onSave: () => void;
}

const ConsumablesHeader: React.FC<ConsumablesHeaderProps> = ({ onOpenSaved, onSave }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium">Ajouter un consommable</h3>
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onOpenSaved}
        >
          <Database className="w-4 h-4 mr-2" />
          Consommables sauvegardés
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default ConsumablesHeader;
