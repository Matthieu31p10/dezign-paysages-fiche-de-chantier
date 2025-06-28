import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Plus, UserCheck, Users, Settings } from 'lucide-react';
import { ClientConnection, ClientVisibilityPermissions } from '@/types/models';
import { toast } from 'sonner';
import ClientVisibilityPermissionsComponent from './ClientVisibilityPermissions';

const ClientConnectionsManagement = () => {
  const { settings, updateSettings, projects } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientConnection | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    password: '',
    assignedProjects: [] as string[],
    isActive: true,
    visibilityPermissions: {} as ClientVisibilityPermissions
  });

  const clientConnections = settings.clientConnections || [];
  const activeProjects = projects.filter(p => !p.isArchived);

  const resetForm = () => {
    setFormData({
      clientName: '',
      email: '',
      password: '',
      assignedProjects: [],
      isActive: true,
      visibilityPermissions: {
        showProjectName: true,
        showAddress: true,
        showWorkLogs: true,
        showTasks: true,
      }
    });
    setEditingClient(null);
  };

  const handleAddClient = async () => {
    if (!formData.clientName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier si l'email existe déjà
    const emailExists = clientConnections.some(client => 
      client.email === formData.email && client.id !== editingClient?.id
    );
    
    if (emailExists) {
      toast.error('Cet email est déjà utilisé');
      return;
    }

    const newClient: ClientConnection = {
      id: crypto.randomUUID(),
      clientName: formData.clientName,
      email: formData.email,
      password: formData.password,
      assignedProjects: formData.assignedProjects,
      isActive: formData.isActive,
      visibilityPermissions: formData.visibilityPermissions,
      createdAt: new Date()
    };

    const updatedClients = editingClient 
      ? clientConnections.map(client => 
          client.id === editingClient.id 
            ? { ...editingClient, ...formData } 
            : client
        )
      : [...clientConnections, newClient];

    await updateSettings({ 
      clientConnections: updatedClients 
    });

    toast.success(editingClient ? 'Client mis à jour' : 'Client ajouté avec succès');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditClient = (client: ClientConnection) => {
    setEditingClient(client);
    setFormData({
      clientName: client.clientName,
      email: client.email,
      password: client.password,
      assignedProjects: client.assignedProjects,
      isActive: client.isActive,
      visibilityPermissions: client.visibilityPermissions || {
        showProjectName: true,
        showAddress: true,
        showWorkLogs: true,
        showTasks: true,
      }
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    const updatedClients = clientConnections.filter(client => client.id !== clientId);
    await updateSettings({ clientConnections: updatedClients });
    toast.success('Client supprimé');
  };

  const toggleClientStatus = async (clientId: string, isActive: boolean) => {
    const updatedClients = clientConnections.map(client =>
      client.id === clientId ? { ...client, isActive } : client
    );
    await updateSettings({ clientConnections: updatedClients });
    toast.success(`Client ${isActive ? 'activé' : 'désactivé'}`);
  };

  const getProjectName = (projectId: string) => {
    const project = activeProjects.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  const handleProjectToggle = (projectId: string, isSelected: boolean) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        assignedProjects: [...prev.assignedProjects, projectId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignedProjects: prev.assignedProjects.filter(id => id !== projectId)
      }));
    }
  };

  const handlePermissionChange = (key: keyof ClientVisibilityPermissions, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      visibilityPermissions: {
        ...prev.visibilityPermissions,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Clients de connexion</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les accès clients pour consulter leurs chantiers
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un client
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Modifier le client' : 'Ajouter un client'}
              </DialogTitle>
              <DialogDescription>
                Créez un accès client et configurez les informations qu'il pourra consulter
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="projects">Chantiers assignés</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nom du client *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Nom du client"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@exemple.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Compte actif</Label>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div>
                  <Label>Chantiers assignés</Label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {activeProjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun chantier actif disponible</p>
                    ) : (
                      activeProjects.map(project => (
                        <div key={project.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`project-${project.id}`}
                            checked={formData.assignedProjects.includes(project.id)}
                            onChange={(e) => handleProjectToggle(project.id, e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor={`project-${project.id}`} className="text-sm">
                            {project.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <ClientVisibilityPermissionsComponent
                  permissions={formData.visibilityPermissions}
                  onPermissionChange={handlePermissionChange}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddClient}>
                {editingClient ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {clientConnections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun client de connexion</h3>
            <p className="text-muted-foreground text-center mb-4">
              Créez des comptes clients pour leur permettre de consulter leurs chantiers
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clientConnections.map(client => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{client.clientName}</CardTitle>
                      <CardDescription>{client.email}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={client.isActive ? "default" : "secondary"}>
                      {client.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClient(client)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleClientStatus(client.id, !client.isActive)}
                      >
                        <Switch checked={client.isActive} className="pointer-events-none" />
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div>
                  <Label className="text-sm font-medium">Chantiers assignés:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {client.assignedProjects.length === 0 ? (
                      <Badge variant="outline">Aucun chantier assigné</Badge>
                    ) : (
                      client.assignedProjects.map(projectId => (
                        <Badge key={projectId} variant="secondary">
                          {getProjectName(projectId)}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  Créé le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                  {client.lastLogin && (
                    <span> • Dernière connexion: {new Date(client.lastLogin).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientConnectionsManagement;
