
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { handleAuthError } from '@/utils/error';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, AlertCircle, UserCheck, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClientAuth from './ClientAuth';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { settings } = useApp();
  const { signIn, signUp, user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up
        const { error: signUpError } = await signUp(email, password, {
          firstName,
          lastName
        });

        if (signUpError) {
          setError(signUpError.message);
          toast.error(signUpError.message);
        } else {
          toast.success('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
          setIsSignUp(false);
          setFirstName('');
          setLastName('');
          setPassword('');
        }
      } else {
        // Sign in
        const { error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError.message);
          toast.error(signInError.message);
        } else {
          toast.success('Connexion réussie');
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
      handleAuthError(err, isSignUp ? 'signup' : 'login');
      toast.error(errorMessage);
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
        <Card className="w-full backdrop-blur-sm bg-background/90 shadow-lg border-border/20 hover:shadow-xl transition-all duration-300">
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
                <form onSubmit={handleUserSubmit} className="space-y-4" aria-label="Formulaire d'authentification utilisateur">
                  {isSignUp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground" aria-hidden="true">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="pl-10"
                            placeholder="Votre prénom"
                            required={isSignUp}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground" aria-hidden="true">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="pl-10"
                            placeholder="Votre nom"
                            required={isSignUp}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground" aria-hidden="true">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="votre@email.com"
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
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground">
                        12+ caractères, majuscules, minuscules, chiffres et caractères spéciaux
                      </p>
                    )}
                  </div>
                  <LoadingButton
                    type="submit"
                    className="w-full hover:scale-105 transition-transform duration-200"
                    loading={isLoading || loading}
                    loadingText={isSignUp ? "Création..." : "Connexion..."}
                    variant="default"
                  >
                    {isSignUp ? 'Créer un compte' : 'Se connecter'}
                  </LoadingButton>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
                  </button>
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
