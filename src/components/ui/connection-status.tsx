
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { WifiOff, Wifi, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const { isConnected, isLoading, lastChecked, checkConnection } = useSupabaseStatus();
  
  // Formatter la dernière vérification
  const formattedTime = lastChecked 
    ? new Intl.DateTimeFormat('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }).format(lastChecked)
    : 'Jamais';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => checkConnection()}
            className={`rounded-full p-1.5 ${className} ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              {isConnected 
                ? '✅ Connecté à la base de données'
                : '❌ Déconnecté de la base de données'}
            </p>
            <p className="text-xs text-muted-foreground">
              Dernière vérification: {formattedTime}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cliquez pour vérifier à nouveau
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
