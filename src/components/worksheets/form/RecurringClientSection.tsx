
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BlankWorkSheetValues } from '../schema';
import { Users } from 'lucide-react';
import ClientForm from './recurring-client/ClientForm';
import ClientSelector from './recurring-client/ClientSelector';
import ClientActions from './recurring-client/ClientActions';
import DeleteClientDialog from './recurring-client/DeleteClientDialog';
import { useRecurringClients } from './recurring-client/useRecurringClients';

const RecurringClientSection: React.FC = () => {
  const { control } = useFormContext<BlankWorkSheetValues>();
  const { 
    clients,
    selectedClientId,
    deleteDialogOpen,
    currentClientName,
    setDeleteDialogOpen,
    saveCurrentClient,
    handleClientSelect,
    handleDeleteRequest,
    confirmDeleteClient
  } = useRecurringClients();
  
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-green-50">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium flex items-center text-green-700">
          <Users className="h-5 w-5 mr-2" />
          Client ponctuel
        </h3>
        
        <ClientActions 
          onSaveClient={saveCurrentClient}
          disabled={!currentClientName}
        />
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
        
        <ClientSelector
          clients={clients}
          selectedClientId={selectedClientId}
          onClientSelect={handleClientSelect}
          onDeleteRequest={handleDeleteRequest}
        />
      </div>
      
      <ClientForm />
      
      <DeleteClientDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDeleteClient}
      />
    </div>
  );
};

export default RecurringClientSection;
