
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { handleAuthError } from '@/utils/errorHandler';
import { useLoginHistory } from '@/hooks/useLoginHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, AlertCircle, UserCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientAuth from './ClientAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, settings, auth } = useApp();
  const { recordLogin } = useLoginHistory();
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
        // Record the login
        setTimeout(async () => {
          if (auth.currentUser) {
            await recordLogin(
              auth.currentUser.email || username,
              auth.currentUser.name || username,
              auth.currentUser.id || username
            );
          }
        }, 100);
        
        navigate(from, { replace: true });
      } else {
        setError('Identifiant ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      handleAuthError(err, 'login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientLogin = (client: any) => {
    // La logique de connexion client est maintenant gérée dans ClientAuth
    // Client connected successfully
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
      role="main"
      aria-label="Page de connexion"
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
              <Alert variant="destructive" className="mb-4" role="alert" id="login-error">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="user" className="w-full" aria-label="Type de connexion">
              <TabsList className="grid w-full grid-cols-2" role="tablist" aria-label="Choix du type de connexion">
                <TabsTrigger value="user" className="flex items-center gap-2" aria-label="Connexion utilisateur">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Utilisateur
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2" aria-label="Connexion client">
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                  Client
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="space-y-4 mt-4" role="tabpanel" aria-labelledby="user-tab">
                <form onSubmit={handleUserSubmit} className="space-y-4" aria-label="Formulaire de connexion utilisateur">
                  <div className="space-y-2">
                    <Label htmlFor="username">Identifiant</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground" aria-hidden="true">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        placeholder="Votre identifiant"
                        aria-describedby={error ? "login-error" : undefined}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground" aria-hidden="true">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        placeholder="Votre mot de passe"
                        aria-describedby={error ? "login-error" : undefined}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    aria-describedby={isLoading ? "loading-status" : undefined}
                  >
                    {isLoading ? (
                      <>
                        <span id="loading-status" className="sr-only">Connexion en cours</span>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="client" className="space-y-4 mt-4">
                <ClientAuth 
                  onClientLogin={handleClientLogin} 
                  settings={settings} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
