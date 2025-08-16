import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { installApp } = usePWA();

  const handleInstall = () => {
    installApp();
    onDismiss();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm z-50 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Installer l'application</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Accédez rapidement à vos fiches de chantier, même hors ligne.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                Installer
              </Button>
              <Button onClick={onDismiss} variant="outline" size="sm">
                Plus tard
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPrompt;