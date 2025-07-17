import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Mail, UserCheck } from 'lucide-react';
import ClientAuth from './ClientAuth';
import { useSettings } from '@/context/SettingsContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useSupabaseAuth();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, { first_name: firstName, last_name: lastName });
        if (!error) {
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientLogin = (client: any) => {
    // La logique de connexion client est maintenant gérée dans ClientAuth
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
            <CardTitle className="text-2xl text-center font-bold">
              {isSignUp ? 'Inscription' : 'Connexion'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Utilisateur
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                  Client
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2">
                    <Button
                      type="button"
                      variant={!isSignUp ? "default" : "outline"}
                      onClick={() => setIsSignUp(false)}
                      className="w-full"
                    >
                      Connexion
                    </Button>
                    <Button
                      type="button"
                      variant={isSignUp ? "default" : "outline"}
                      onClick={() => setIsSignUp(true)}
                      className="w-full"
                    >
                      Inscription
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Prénom
                            </Label>
                            <Input
                              id="firstName"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Votre prénom"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nom
                            </Label>
                            <Input
                              id="lastName"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Votre nom"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="votre@email.com"
                          required
                          aria-describedby={error ? "error-message" : undefined}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Entrez votre mot de passe"
                          required
                          minLength={6}
                          aria-describedby={error ? "error-message" : undefined}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                      aria-describedby={error ? "error-message" : undefined}
                    >
                      {isLoading 
                        ? (isSignUp ? 'Création...' : 'Connexion...') 
                        : (isSignUp ? 'Créer un compte' : 'Se connecter')
                      }
                    </Button>
                  </form>
                </div>
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