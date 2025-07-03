
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { ClientConnection } from '@/types/models';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import { useClientConnections } from '@/hooks/useClientConnections';

const ClientConnectionsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientConnection | null>(null);

  const {
    clientConnections,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting
  } = useClientConnections();

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    setEditingClient(null);
  };

  const handleFormCancel = () => {
    setIsAddDialogOpen(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: ClientConnection) => {
    setEditingClient(client);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    deleteClient(clientId);
  };

  const handleToggleStatus = async (clientId: string, isActive: boolean) => {
    updateClient({ id: clientId, data: { isActive } });
  };

  const resetAndOpenDialog = () => {
    setEditingClient(null);
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des clients...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Connexions clients</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les accès clients pour consulter leurs chantiers
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetAndOpenDialog} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Modifier le client' : 'Nouveau client'}
              </DialogTitle>
              <DialogDescription>
                Configurez l'accès client et les informations qu'il pourra consulter
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Informations</TabsTrigger>
                <TabsTrigger value="projects">Chantiers</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <ClientForm
                  editingClient={editingClient}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                  createClient={createClient}
                  updateClient={updateClient}
                  isSubmitting={isCreating || isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Assignation des chantiers</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sélectionnez les chantiers auxquels ce client aura accès
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Permissions de visibilité</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configurez les informations que le client pourra voir
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <ClientList
        clients={clientConnections}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onToggleStatus={handleToggleStatus}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ClientConnectionsManagement;
