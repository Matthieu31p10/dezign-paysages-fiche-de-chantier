
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { RecurringClient } from './types';
import { BlankWorkSheetValues } from '../../schema';

export const useRecurringClients = () => {
  const { control, setValue, watch } = useFormContext<BlankWorkSheetValues>();
  const [clients, setClients] = useState<RecurringClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("new");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentClientName = watch('clientName');
  
  // In the future, load clients from database
  // This would be implemented with a React Query hook
  
  // Save current client info to database (in the future)
  const saveCurrentClient = () => {
    const clientName = control._formValues.clientName;
    const address = control._formValues.address;
    const phone = control._formValues.contactPhone;
    const email = control._formValues.contactEmail;
    
    if (!clientName) {
      toast({
        title: "Nom du client manquant",
        description: "Veuillez saisir au moins le nom du client pour l'enregistrer",
        variant: "destructive",
      });
      return;
    }
    
    // Check if client already exists
    const existingClientIndex = clients.findIndex(c => c.name.toLowerCase() === clientName.toLowerCase());
    
    let updatedClients: RecurringClient[];
    let message: string;
    
    if (existingClientIndex >= 0) {
      // Update existing client
      updatedClients = [...clients];
      updatedClients[existingClientIndex] = {
        ...updatedClients[existingClientIndex],
        address: address || updatedClients[existingClientIndex].address,
        phone: phone || updatedClients[existingClientIndex].phone,
        email: email || updatedClients[existingClientIndex].email,
      };
      message = `Les informations de ${clientName} ont été mises à jour`;
      setSelectedClientId(updatedClients[existingClientIndex].id);
    } else {
      // Create new client
      const newClient: RecurringClient = {
        id: crypto.randomUUID(),
        name: clientName,
        address: address || '',
        phone: phone || '',
        email: email || '',
      };
      
      updatedClients = [...clients, newClient];
      message = `Les informations de ${clientName} ont été sauvegardées`;
      setSelectedClientId(newClient.id);
    }
    
    setClients(updatedClients);
    // In the future, save to database
    
    toast({
      title: "Client enregistré",
      description: message,
      variant: "default",
    });
  };
  
  // Select a client from the list
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    
    if (clientId === 'new') {
      // Clear the form
      setValue('clientName', '');
      setValue('address', '');
      setValue('contactPhone', '');
      setValue('contactEmail', '');
      return;
    }
    
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setValue('clientName', selectedClient.name);
      setValue('address', selectedClient.address);
      setValue('contactPhone', selectedClient.phone);
      setValue('contactEmail', selectedClient.email);
    }
  };
  
  // Delete a client (would be from database in the future)
  const handleDeleteRequest = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    
    const updatedClients = clients.filter(c => c.id !== clientToDelete);
    setClients(updatedClients);
    // In the future, delete from database
    
    // If the deleted client was selected, clear the selection
    if (selectedClientId === clientToDelete) {
      setSelectedClientId('new');
    }
    
    toast({
      title: "Client supprimé",
      description: "Les informations du client ont été supprimées",
      variant: "default",
    });
    
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };
  
  return {
    clients,
    selectedClientId,
    deleteDialogOpen,
    clientToDelete,
    currentClientName,
    setDeleteDialogOpen,
    saveCurrentClient,
    handleClientSelect,
    handleDeleteRequest,
    confirmDeleteClient
  };
};
