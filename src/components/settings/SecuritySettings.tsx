import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Smartphone, Key, AlertTriangle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getPasswordStrength } from '@/utils/security';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import MFASetup from '@/components/auth/MFASetup';

const SecuritySettings = () => {
  const { user, updatePassword, checkMFAStatus } = useSupabaseAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState({ isEnabled: false, factors: [] });
  const [showMFASetup, setShowMFASetup] = useState(false);

  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    const status = await checkMFAStatus();
    setMfaStatus(status);
  };

  const passwordStrength = getPasswordStrength(newPassword);
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordStrength === 'weak') {
      toast.error('Le mot de passe est trop faible. Utilisez au moins 12 caractères avec une combinaison de majuscules, minuscules, chiffres et caractères spéciaux.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;

      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAComplete = () => {
    setShowMFASetup(false);
    loadMFAStatus();
    toast.success('Authentification à deux facteurs configurée avec succès !');
  };

  return (
    <div className="space-y-6">
      {/* Statut de sécurité global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Statut de Sécurité
          </CardTitle>
          <CardDescription>
            Vue d'ensemble de la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Authentification forte */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${mfaStatus.isEnabled ? 'bg-success/10' : 'bg-warning/10'}`}>
                  <Smartphone className={`h-4 w-4 ${mfaStatus.isEnabled ? 'text-success' : 'text-warning'}`} />
                </div>
                <div>
                  <p className="font-medium">Authentification 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    {mfaStatus.isEnabled ? 'Activée' : 'Désactivée'}
                  </p>
                </div>
              </div>
              <Badge variant={mfaStatus.isEnabled ? 'default' : 'secondary'}>
                {mfaStatus.isEnabled ? 'Sécurisé' : 'À configurer'}
              </Badge>
            </div>

            {/* Protection email */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Email Vérifié</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Badge variant="default">Vérifié</Badge>
            </div>
          </div>

          {!mfaStatus.isEnabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommandation sécurité :</strong> Activez l'authentification à deux facteurs 
                pour une protection renforcée contre les accès non autorisés.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration MFA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Authentification à Deux Facteurs (2FA)
          </CardTitle>
          <CardDescription>
            Renforcez la sécurité avec une couche d'authentification supplémentaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!mfaStatus.isEnabled ? (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Pourquoi activer la 2FA ?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Protection contre le piratage de mots de passe</li>
                  <li>• Sécurité renforcée même en cas de fuite de données</li>
                  <li>• Conformité aux standards de sécurité modernes</li>
                  <li>• Notification en cas de tentative d'accès suspect</li>
                </ul>
              </div>
              
              {showMFASetup ? (
                <MFASetup 
                  onComplete={handleMFAComplete}
                  onSkip={() => setShowMFASetup(false)}
                />
              ) : (
                <Button onClick={() => setShowMFASetup(true)} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Configurer l'Authentification 2FA
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  L'authentification à deux facteurs est active sur votre compte
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Facteurs configurés :</strong> {mfaStatus.factors.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous devrez fournir un code de votre application d'authentification à chaque connexion
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité du Mot de Passe
          </CardTitle>
          <CardDescription>
            Maintenez un mot de passe fort et sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe sécurisé"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {newPassword && (
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
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Critères de sécurité (ANSSI) :</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Minimum 12 caractères (recommandé: 16+)</li>
                <li>• Majuscules, minuscules, chiffres et caractères spéciaux</li>
                <li>• Pas de répétitions ou de séquences communes</li>
                <li>• Unique et non réutilisé ailleurs</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || passwordStrength === 'weak' || newPassword !== confirmPassword}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;