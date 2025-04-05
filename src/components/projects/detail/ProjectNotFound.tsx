
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProjectNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-medium mb-4">Chantier non trouvé</h2>
      <Button onClick={() => navigate('/projects')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste
      </Button>
    </div>
  );
};

export default ProjectNotFound;
