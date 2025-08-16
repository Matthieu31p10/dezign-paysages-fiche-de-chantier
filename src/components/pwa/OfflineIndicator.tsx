import React from 'react';
import { Card } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <Card className="fixed top-16 left-4 right-4 mx-auto max-w-sm z-40 bg-destructive/90 backdrop-blur-sm border-destructive">
      <div className="p-3 flex items-center gap-2 text-destructive-foreground">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">Mode hors ligne</span>
      </div>
    </Card>
  );
};

export default OfflineIndicator;