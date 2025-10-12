import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback = ({ message = "Chargement..." }: LoadingFallbackProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-base text-muted-foreground">Chargement de la page...</p>
      </div>
    </div>
  );
};
