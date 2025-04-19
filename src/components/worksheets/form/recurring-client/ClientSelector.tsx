
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RecurringClient } from './types';

interface ClientSelectorProps {
  clients: RecurringClient[];
  selectedClientId: string;
  onClientSelect: (clientId: string) => void;
  onDeleteRequest: (clientId: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClientId,
  onClientSelect,
  onDeleteRequest
}) => {
  return (
    <div className="w-1/3 space-y-1">
      <label className="text-sm font-medium mb-2 block">Clients enregistrés</label>
      <Select value={selectedClientId} onValueChange={onClientSelect}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">-- Nouveau client --</SelectItem>
          {clients.map(client => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedClientId && selectedClientId !== "new" && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDeleteRequest(selectedClientId)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start mt-1"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" />
          Supprimer ce client
        </Button>
      )}
    </div>
  );
};

export default ClientSelector;
