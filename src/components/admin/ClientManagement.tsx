import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClientConnection } from '@/hooks/useClientAuth';
import { Users, Mail, Key, Eye, Settings } from 'lucide-react';

interface ClientManagementProps {
  clients: ClientConnection[];
  onClientUpdate: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, onClientUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientConnection | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    password: '',
    assigned_projects: [] as string[],
    visibility_permissions: {
      showTasks: true,
      showAddress: true,
      showWorkLogs: true,
      showProjectName: true
    },
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      client_name: '',
      email: '',
      password: '',
      assigned_projects: [],
      visibility_permissions: {
        showTasks: true,
        showAddress: true,
        showWorkLogs: true,
        showProjectName: true
      },
      is_active: true
    });
    setIsCreating(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        // Update existing client
        const { error } = await supabase
          .from('client_connections')
          .update(formData)
          .eq('id', editingClient.id);
        
        if (error) throw error;
        toast.success('Client mis à jour avec succès');
      } else {
        // Create new client
        const { error } = await supabase
          .from('client_connections')
          .insert(formData);
        
        if (error) throw error;
        toast.success('Client créé avec succès');
      }
      
      resetForm();
      onClientUpdate();
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (client: ClientConnection) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      email: client.email,
      password: '', // Ne pas pré-remplir le mot de passe
      assigned_projects: client.assigned_projects || [],
      visibility_permissions: client.visibility_permissions || {
        showTasks: true,
        showAddress: true,
        showWorkLogs: true,
        showProjectName: true
      },
      is_active: client.is_active
    });
    setIsCreating(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('client_connections')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
      toast.success('Client supprimé avec succès');
      onClientUpdate();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleStatus = async (client: ClientConnection) => {
    try {
      const { error } = await supabase
        .from('client_connections')
        .update({ is_active: !client.is_active })
        .eq('id', client.id);
      
      if (error) throw error;
      toast.success(`Client ${!client.is_active ? 'activé' : 'désactivé'}`);
      onClientUpdate();
    } catch (error) {
      console.error('Error toggling client status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Clients</h2>
          <p className="text-muted-foreground">
            Gérez les accès clients à leurs projets
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Users className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {editingClient ? 'Modifier le Client' : 'Nouveau Client'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nom du client</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mot de passe {editingClient && '(laisser vide pour ne pas changer)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingClient}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissions de visibilité</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showProjectName"
                      checked={formData.visibility_permissions.showProjectName}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          visibility_permissions: {
                            ...formData.visibility_permissions,
                            showProjectName: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="showProjectName">Nom des projets</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showAddress"
                      checked={formData.visibility_permissions.showAddress}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          visibility_permissions: {
                            ...formData.visibility_permissions,
                            showAddress: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="showAddress">Adresses</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showWorkLogs"
                      checked={formData.visibility_permissions.showWorkLogs}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          visibility_permissions: {
                            ...formData.visibility_permissions,
                            showWorkLogs: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="showWorkLogs">Fiches de travail</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showTasks"
                      checked={formData.visibility_permissions.showTasks}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData,
                          visibility_permissions: {
                            ...formData.visibility_permissions,
                            showTasks: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="showTasks">Tâches détaillées</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Compte actif</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingClient ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Clients List */}
      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{client.client_name}</h3>
                    <Badge variant={client.is_active ? "default" : "secondary"}>
                      {client.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Projets assignés:</strong> {client.assigned_projects?.length || 0}
                  </div>

                  {client.last_login && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Dernière connexion:</strong> {new Date(client.last_login).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(client)}
                  >
                    {client.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(client)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun client configuré</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier client pour commencer
            </p>
            <Button onClick={() => setIsCreating(true)}>
              Créer un client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientManagement;