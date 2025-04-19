
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowLeft, FileBarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlankWorkSheetHeaderProps {
  onCreateNew: () => void;
}

const BlankWorkSheetHeader: React.FC<BlankWorkSheetHeaderProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Fiches Vierges</h1>
        <p className="text-muted-foreground">
          Créez et consultez des fiches pour des travaux ponctuels sans lien avec un chantier existant, ou des travaux complémentaires sur des chantiers existants
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onCreateNew}
          variant="default"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          Nouvelle fiche vierge
        </Button>
        
        <Button
          onClick={() => navigate('/worklogs')}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voir les fiches de suivi
        </Button>
        
        <Button
          onClick={() => navigate('/projects')}
          variant="outline"
        >
          <FileBarChart className="w-4 h-4 mr-2" />
          Voir les projets
        </Button>
      </div>
    </div>
  );
};

export default BlankWorkSheetHeader;
