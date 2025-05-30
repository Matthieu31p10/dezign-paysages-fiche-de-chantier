
import ProjectForm from '@/components/projects/ProjectForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const ProjectNew = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCancel = () => {
    navigate('/projects');
  };
  
  const handleSuccess = () => {
    navigate('/projects');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate('/projects')}
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Nouvelle fiche chantier</h1>
        </div>
      </div>
      
      <ProjectForm onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  );
};

export default ProjectNew;
