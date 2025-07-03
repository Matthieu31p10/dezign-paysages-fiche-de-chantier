
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientConnection } from '@/types/models';
import { isValidEmail, sanitizeInput } from '@/utils/security';
import { toast } from 'sonner';
import { clientConnectionsService } from '@/services/clientConnectionsService';

interface ClientAuthProps {
  onClientLogin: (client: ClientConnection) => void;
  settings: any;
}

const ClientAuth = ({ onClientLogin }: ClientAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error('Format d\'email invalide');
      return;
    }

    if (!password.trim()) {
      toast.error('Mot de passe requis');
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      
      const client = await clientConnectionsService.findByEmailAndPassword(
        sanitizedEmail, 
        password
      );

      if (client) {
        // Mettre à jour la date de dernière connexion
        await clientConnectionsService.update(client.id, {
          lastLogin: new Date()
        });

        const updatedClient = { 
          ...client, 
          lastLogin: new Date() 
        };
        
        // Stockage sécurisé de la session
        const sessionData = {
          id: updatedClient.id,
          clientName: updatedClient.clientName,
          email: updatedClient.email,
          assignedProjects: updatedClient.assignedProjects,
          visibilityPermissions: updatedClient.visibilityPermissions,
          lastLogin: updatedClient.lastLogin,
          sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
        };
        
        localStorage.setItem('clientSession', JSON.stringify(sessionData));
        onClientLogin(updatedClient);
        navigate('/client-dashboard', { replace: true });
        toast.success('Connexion réussie');
      } else {
        toast.error('Identifiants incorrects ou compte inactif');
      }
    } catch (error) {
      console.error('Erreur de connexion client:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="clientEmail" className="text-sm font-medium">Email</label>
        <input
          id="clientEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Votre email"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="clientPassword" className="text-sm font-medium">Mot de passe</label>
        <input
          id="clientPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Votre mot de passe"
          required
          disabled={isLoading}
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};

export default ClientAuth;
