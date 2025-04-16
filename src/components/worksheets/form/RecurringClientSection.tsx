
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BlankWorkSheetValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, User, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface RecurringClient {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const STORAGE_KEY = 'recurring-clients';

const RecurringClientSection: React.FC = () => {
  const { control, setValue, watch } = useFormContext<BlankWorkSheetValues>();
  const [clients, setClients] = useState<RecurringClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentClientName = watch('clientName');
  
  // Load saved clients from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem(STORAGE_KEY);
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch (e) {
        console.error('Error loading recurring clients:', e);
      }
    }
  }, []);
  
  // Save current client info
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
    
    toast({
      title: "Client enregistré",
      description: message,
      variant: "default",
    });
  };
  
  // Select a client from the list
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    
    if (clientId === '') {
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
  
  // Delete a client
  const handleDeleteRequest = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    
    const updatedClients = clients.filter(c => c.id !== clientToDelete);
    setClients(updatedClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
    
    // If the deleted client was selected, clear the selection
    if (selectedClientId === clientToDelete) {
      setSelectedClientId('');
    }
    
    toast({
      title: "Client supprimé",
      description: "Les informations du client ont été supprimées",
      variant: "default",
    });
    
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };
  
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-green-50">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium flex items-center text-green-700">
          <Users className="h-5 w-5 mr-2" />
          Client ponctuel
        </h3>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={saveCurrentClient}
          className="bg-white hover:bg-green-100 text-green-700 border-green-200"
          disabled={!currentClientName}
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder ce client
        </Button>
      </div>
      
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <FormField
            control={control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du client</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du client" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="w-1/3 space-y-1">
          <label className="text-sm font-medium mb-2 block">Clients enregistrés</label>
          <Select value={selectedClientId} onValueChange={handleClientSelect}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Nouveau client --</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedClientId && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDeleteRequest(selectedClientId)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start mt-1"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Supprimer ce client
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse du chantier" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de téléphone" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Adresse email" type="email" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les informations du client seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClient} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecurringClientSection;
