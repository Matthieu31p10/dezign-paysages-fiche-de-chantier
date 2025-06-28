
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, AlertCircle, UserCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Identifiant ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const clientConnections = settings.clientConnections || [];
      const client = clientConnections.find(c => 
        c.email === clientEmail && 
        c.password === clientPassword && 
        c.isActive
      );

      if (client) {
        // Update last login
        const updatedClient = { ...client, lastLogin: new Date() };
        const updatedConnections = clientConnections.map(c => 
          c.id === client.id ? updatedClient : c
        );
        
        // Store client session
        localStorage.setItem('clientSession', JSON.stringify(updatedClient));
        
        // Navigate to client dashboard
        navigate('/client-dashboard', { replace: true });
      } else {
        setError('Email ou mot de passe incorrect, ou compte inactif');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Client login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundImage = settings.loginBackgroundImage;
  const backgroundStyle = backgroundImage 
    ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } 
    : { backgroundImage: 'none' };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-muted/30"
      style={backgroundStyle}
    >
      <div className="w-full max-w-md p-4">
        <Card className="w-full backdrop-blur-sm bg-background/90 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Connexion</CardTitle>
            <CardDescription className="text-center">
              Choisissez votre type de connexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Utilisateur
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Client
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="space-y-4 mt-4">
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Identifiant</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        placeholder="Votre identifiant"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        placeholder="Votre mot de passe"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="client" className="space-y-4 mt-4">
                <form onSubmit={handleClientSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="pl-10"
                        placeholder="Votre email"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPassword">Mot de passe</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="clientPassword"
                        type="password"
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        className="pl-10"
                        placeholder="Votre mot de passe"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion en cours...' : 'Se connecter comme client'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="px-6 text-center text-sm text-muted-foreground">
              <span className="font-medium">Note:</span> L'identifiant par défaut est "admin" et le mot de passe est "admin"
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
