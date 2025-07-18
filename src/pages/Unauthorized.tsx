
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="rounded-full bg-red-100 p-6 mb-6">
        <Lock className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">Accès non autorisé</h1>
      <p className="text-muted-foreground text-center mb-6">
        Vous n'avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={() => navigate('/')}>
          Accueil
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
