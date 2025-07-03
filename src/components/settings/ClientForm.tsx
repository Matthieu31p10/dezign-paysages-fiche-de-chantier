
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ClientConnection, ClientVisibilityPermissions } from '@/types/models';
import { isValidEmail, sanitizeInput, isValidPassword } from '@/utils/security';

interface ClientFormProps {
  editingClient?: ClientConnection | null;
  onSuccess: () => void;
  onCancel: () => void;
  createClient: (data: Omit<ClientConnection, 'id' | 'createdAt'>) => void;
  updateClient: (params: { id: string; data: Partial<ClientConnection> }) => void;
  isSubmitting?: boolean;
}

const ClientForm = ({ 
  editingClient, 
  onSuccess, 
  onCancel,
  createClient,
  updateClient,
  isSubmitting = false
}: ClientFormProps) => {
  const { projects } = useApp();
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

  const activeProjects = projects.filter(p => !p.isArchived);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientName.trim()) {
      return;
    }

    if (!isValidEmail(formData.email)) {
      return;
    }

    if (!isValidPassword(formData.password)) {
      return;
    }

    try {
      const sanitizedData = {
        ...formData,
        clientName: sanitizeInput(formData.clientName),
        email: sanitizeInput(formData.email.toLowerCase()),
      };

      if (editingClient) {
        updateClient({ 
          id: editingClient.id, 
          data: sanitizedData 
        });
      } else {
        createClient({
          ...sanitizedData,
          createdAt: new Date()
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        <Label htmlFor="isActive">Compte actif</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : (editingClient ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
