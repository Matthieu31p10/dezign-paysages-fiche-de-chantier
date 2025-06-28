
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ClientConnection } from '@/types/models';
import { Settings, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ClientListProps {
  clients: ClientConnection[];
  onEditClient: (client: ClientConnection) => void;
  onDeleteClient: (clientId: string) => void;
  onToggleStatus: (clientId: string, isActive: boolean) => void;
}

const ClientList = ({ clients, onEditClient, onDeleteClient, onToggleStatus }: ClientListProps) => {
  const { projects } = useApp();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const togglePasswordVisibility = (clientId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Aucun client configuré</h3>
            <p className="text-muted-foreground">
              Créez des comptes clients pour leur permettre d'accéder à leurs chantiers
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {clients.map(client => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{client.clientName}</CardTitle>
                <CardDescription>{client.email}</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={client.isActive ? "default" : "secondary"}>
                  {client.isActive ? 'Actif' : 'Inactif'}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditClient(client)}
                    title="Modifier"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={client.isActive ? "secondary" : "default"}
                    size="icon"
                    onClick={() => onToggleStatus(client.id, !client.isActive)}
                    title={client.isActive ? "Désactiver" : "Activer"}
                  >
                    {client.isActive ? "🔒" : "🔓"}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteClient(client.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Identifiants de connexion sécurisés */}
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">
                Identifiants de connexion :
              </Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded text-sm">
                      {client.email}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(client.email, 'Email')}
                      title="Copier l'email"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mot de passe:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded text-sm">
                      {showPasswords[client.id] ? client.password : '••••••••'}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(client.id)}
                      title="Afficher/Masquer le mot de passe"
                    >
                      {showPasswords[client.id] ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(client.password, 'Mot de passe')}
                      title="Copier le mot de passe"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
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
                <span>
                  {' • '}Dernière connexion: {new Date(client.lastLogin).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientList;
