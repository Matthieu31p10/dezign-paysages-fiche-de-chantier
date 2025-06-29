
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Users, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModernSidebarDialogsProps {
  showConstraintsDialog: boolean;
  showTeamsDialog: boolean;
  onConstraintsDialogChange: (open: boolean) => void;
  onTeamsDialogChange: (open: boolean) => void;
}

const ModernSidebarDialogs: React.FC<ModernSidebarDialogsProps> = ({
  showConstraintsDialog,
  showTeamsDialog,
  onConstraintsDialogChange,
  onTeamsDialogChange
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Constraints Dialog */}
      <Dialog open={showConstraintsDialog} onOpenChange={onConstraintsDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gérer les contraintes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configurez les contraintes de planification pour vos projets.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onConstraintsDialogChange(false);
                  navigate('/schedule');
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Verrouillages de projets
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onConstraintsDialogChange(false);
                  navigate('/schedule');
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Règles de planification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Teams Dialog */}
      <Dialog open={showTeamsDialog} onOpenChange={onTeamsDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des équipes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Gérez vos équipes et leur affectation aux projets.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onTeamsDialogChange(false);
                  navigate('/settings?tab=teams');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres des équipes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onTeamsDialogChange(false);
                  navigate('/schedule');
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planning par équipe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModernSidebarDialogs;
