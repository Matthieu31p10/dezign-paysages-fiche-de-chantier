
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ClientActionsProps {
  onSaveClient: () => void;
  disabled: boolean;
}

const ClientActions: React.FC<ClientActionsProps> = ({ onSaveClient, disabled }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={onSaveClient}
      className="bg-white hover:bg-green-100 text-green-700 border-green-200"
      disabled={disabled}
    >
      <Save className="h-4 w-4 mr-2" />
      Sauvegarder ce client
    </Button>
  );
};

export default ClientActions;
