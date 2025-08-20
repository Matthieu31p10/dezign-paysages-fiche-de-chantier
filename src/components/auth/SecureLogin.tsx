import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, AlertCircle, UserCheck, Shield, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getPasswordStrength, isValidEmail } from '@/utils/security';
import { toast } from 'sonner';
import ClientAuth from './ClientAuth';

const SecureLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, resetPassword } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const passwordStrength = getPasswordStrength(password);
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'strong': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getStrengthValue = (strength: string) => {
    switch (strength) {
      case 'weak': return 25;
      case 'medium': return 60;
      case 'strong': return 100;
      default: return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isValidEmail(email)) {
        throw new Error('Format d\'email invalide');
      }

      if (isSignUp) {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('Prénom et nom sont requis');
        }

        const { error } = await signUp(email, password, { firstName, lastName });
        if (error) throw error;

        toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;

        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Veuillez saisir votre email');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Format d\'email invalide');
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      toast.success('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleClientLogin = () => {
    // Géré par ClientAuth
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-muted/30"
      role="main"
      aria-label="Page de connexion sécurisée"
    >
      <div className="w-full max-w-md p-4">
        <Card className="w-full backdrop-blur-sm bg-background/90 shadow-lg border-border/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold flex items-center gap-2 justify-center">
              <Shield className="h-6 w-6 text-primary" />
              Connexion Sécurisée
            </CardTitle>
            <CardDescription className="text-center">
              Authentification renforcée avec protection avancée
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4" role="alert">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Votre prénom"
                            required={isSignUp}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="votre.email@exemple.com"
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
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Votre mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {isSignUp && password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Force du mot de passe:</span>
                          <span className={`font-medium ${
                            passwordStrength === 'weak' ? 'text-destructive' :
                            passwordStrength === 'medium' ? 'text-warning' : 'text-success'
                          }`}>
                            {passwordStrength === 'weak' ? 'Faible' :
                             passwordStrength === 'medium' ? 'Moyenne' : 'Forte'}
                          </span>
                        </div>
                        <Progress 
                          value={getStrengthValue(passwordStrength)} 
                          className="h-2"
                        />
                        {passwordStrength === 'weak' && (
                          <p className="text-xs text-muted-foreground">
                            Utilisez au moins 12 caractères avec majuscules, minuscules, chiffres et caractères spéciaux
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <LoadingButton
                    type="submit"
                    className="w-full hover:scale-105 transition-transform duration-200"
                    loading={isLoading}
                    loadingText={isSignUp ? "Inscription..." : "Connexion..."}
                    variant="default"
                  >
                    {isSignUp ? "S'inscrire" : "Se connecter"}
                  </LoadingButton>
                </form>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
                  </Button>
                  
                  {!isSignUp && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={handleForgotPassword}
                    >
                      Mot de passe oublié ?
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="client" className="space-y-4 mt-4">
                <ClientAuth 
                  onClientLogin={handleClientLogin} 
                  settings={{}} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureLogin;