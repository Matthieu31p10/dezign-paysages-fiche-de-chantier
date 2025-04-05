
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Fiches de travaux</h1>
        <p className="text-muted-foreground">
          Suivez et gérez efficacement les fiches de travaux.
        </p>
      </div>
      <Button onClick={() => navigate('/worktasks/new')}>
        <Plus className="w-4 h-4 mr-2" />
        Ajouter une fiche
      </Button>
    </div>
  );
};

export default Header;
