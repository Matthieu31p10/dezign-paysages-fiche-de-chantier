
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ClientConnection, ClientVisibilityPermissions } from '@/types/models';
import { isValidEmail, sanitizeInput, isValidPassword } from '@/utils/security';
import { toast } from 'sonner';

interface ClientFormProps {
  editingClient?: ClientConnection | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClientForm = ({ editingClient, onSuccess, onCancel }: ClientFormProps) => {
  const { settings, updateSettings, projects } = useApp();
  const [formData, setFormData] = useState({
    clientName: editingClient?.clientName || '',
    email: editingClient?.email || '',
    password: editingClient?.password || '',
    assignedProjects: editingClient?.assignedProjects || [] as string[],
    isActive: editingClient?.isActive ?? true,
    visibilityPermissions: editingClient?.visibilityPermissions || {
      showProjectName: true,
      showAddress: true,
      showWorkLogs: true,
      showTasks: true,
    } as ClientVisibilityPermissions
  });

  const clientConnections = settings.clientConnections || [];
  const activeProjects = projects.filter(p => !p.isArchived);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientName.trim()) {
      toast.error('Le nom du client est requis');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Format d\'email invalide');
      return;
    }

    if (!isValidPassword(formData.password)) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Vérifier l'unicité de l'email
    const emailExists = clientConnections.some((client: ClientConnection) => 
      client.email.toLowerCase() === formData.email.toLowerCase() && 
      client.id !== editingClient?.id
    );
    
    if (emailExists) {
      toast.error('Cet email est déjà utilisé');
      return;
    }

    try {
      const sanitizedData = {
        ...formData,
        clientName: sanitizeInput(formData.clientName),
        email: sanitizeInput(formData.email.toLowerCase()),
      };

      if (editingClient) {
        const updatedClients = clientConnections.map((client: ClientConnection) => 
          client.id === editingClient.id 
            ? { ...editingClient, ...sanitizedData } 
            : client
        );
        await updateSettings({ clientConnections: updatedClients });
        toast.success('Client mis à jour avec succès');
      } else {
        const newClient: ClientConnection = {
          id: crypto.randomUUID(),
          ...sanitizedData,
          createdAt: new Date()
        };
        await updateSettings({ 
          clientConnections: [...clientConnections, newClient] 
        });
        toast.success('Client créé avec succès');
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              clientName: e.target.value 
            }))}
            placeholder="Nom du client"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              email: e.target.value 
            }))}
            placeholder="email@exemple.com"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="password">Mot de passe * (min. 8 caractères)</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            password: e.target.value 
          }))}
          placeholder="Mot de passe sécurisé"
          minLength={8}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ 
            ...prev, 
            isActive: checked 
          }))}
        />
        <Label htmlFor="isActive">Compte actif</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {editingClient ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
