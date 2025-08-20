import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MFASetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const MFASetup = ({ onComplete, onSkip }: MFASetupProps) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const enrollMFA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authentificateur mobile'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setStep('verify');
    } catch (err: any) {
      setError('Erreur lors de la configuration MFA: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Veuillez saisir un code à 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode
      });

      if (error) throw error;

      setStep('complete');
      toast.success('Authentification à deux facteurs activée avec succès !');
      
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (err: any) {
      if (err.message.includes('Invalid TOTP code')) {
        setError('Code de vérification invalide. Vérifiez votre application d\'authentification.');
      } else {
        setError('Erreur lors de la vérification: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info('Vous pourrez activer l\'authentification à deux facteurs plus tard dans les paramètres');
    onSkip?.();
  };

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <CardTitle className="text-xl">MFA Activée !</CardTitle>
          <CardDescription>
            L'authentification à deux facteurs est maintenant active sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Votre compte est maintenant protégé par une couche de sécurité supplémentaire
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mb-4">
            Lors de vos prochaines connexions, vous devrez saisir un code de votre application d'authentification
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Configuration MFA</CardTitle>
        <CardDescription>
          Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'setup' && (
          <>
            <div className="text-center space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Application d'authentification requise</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Google Authenticator, Authy, ou Microsoft Authenticator
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Étapes de configuration :</h3>
                <ol className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>1. Téléchargez une application d'authentification</li>
                  <li>2. Scannez le QR code qui apparaîtra</li>
                  <li>3. Saisissez le code de vérification</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={enrollMFA} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Configuration...' : 'Configurer MFA'}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="w-full"
              >
                Ignorer pour l'instant
              </Button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="text-center space-y-4">
              <div className="bg-background border-2 border-border p-4 rounded-lg">
                <img 
                  src={qrCode} 
                  alt="QR Code pour l'authentification MFA" 
                  className="mx-auto max-w-full h-auto"
                />
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Clé secrète (si scan impossible) :</p>
                <code className="text-xs break-all font-mono">{secret}</code>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-10 text-center font-mono text-lg"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Saisissez le code à 6 chiffres de votre application d'authentification
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={verifyMFA} 
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Vérification...' : 'Vérifier et activer'}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setStep('setup')}
                className="w-full"
              >
                Retour
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASetup;