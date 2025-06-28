
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users } from 'lucide-react';
import { ClientConnection } from '@/types/models';
import { toast } from 'sonner';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import ClientVisibilityPermissionsComponent from './ClientVisibilityPermissions';

const ClientConnectionsManagement = () => {
  const { settings, updateSettings, projects } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientConnection | null>(null);

  const clientConnections = settings.clientConnections || [];

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

    try {
      const updatedClients = clientConnections.filter((client: ClientConnection) => 
        client.id !== clientId
      );
      await updateSettings({ clientConnections: updatedClients });
      toast.success('Client supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (clientId: string, isActive: boolean) => {
    try {
      const updatedClients = clientConnections.map((client: ClientConnection) =>
        client.id === clientId ? { ...client, isActive } : client
      );
      await updateSettings({ clientConnections: updatedClients });
      toast.success(`Client ${isActive ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const resetAndOpenDialog = () => {
    setEditingClient(null);
    setIsAddDialogOpen(true);
  };

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
            <Button onClick={resetAndOpenDialog}>
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
                />
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Assignation des chantiers</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sélectionnez les chantiers auxquels ce client aura accès
                  </p>
                  {/* Le formulaire de projets sera géré dans ClientForm */}
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Permissions de visibilité</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configurez les informations que le client pourra voir
                  </p>
                  {/* Les permissions seront gérées dans ClientForm */}
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
      />
    </div>
  );
};

export default ClientConnectionsManagement;
