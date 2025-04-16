
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BlankWorkSheetValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, User, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RecurringClient {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const STORAGE_KEY = 'recurring-clients';

const RecurringClientSection: React.FC = () => {
  const { control, setValue } = useFormContext<BlankWorkSheetValues>();
  const [clients, setClients] = useState<RecurringClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const { toast } = useToast();
  
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
    
    const newClient: RecurringClient = {
      id: crypto.randomUUID(),
      name: clientName,
      address: address || '',
      phone: phone || '',
      email: email || '',
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
    
    toast({
      title: "Client enregistré",
      description: `Les informations de ${clientName} ont été sauvegardées`,
      variant: "default",
    });
    
    setSelectedClientId(newClient.id);
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
        
        <div className="w-1/3">
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
    </div>
  );
};

export default RecurringClientSection;
