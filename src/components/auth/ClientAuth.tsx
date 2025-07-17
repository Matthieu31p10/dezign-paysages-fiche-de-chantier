import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User } from 'lucide-react';
import { useClientAuth } from '@/hooks/useClientAuth';

interface ClientAuthProps {
  onClientLogin: (client: any) => void;
  settings: any;
}

const ClientAuth: React.FC<ClientAuthProps> = ({ onClientLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginClient, loading } = useClientAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const result = await loginClient(email, password);
    
    if (result.success) {
      onClientLogin({ email });
      navigate('/client-dashboard');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Espace Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Votre mot de passe"
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Accès client :</strong> Consultez vos projets, fiches de travail et documents en toute sécurité.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientAuth;