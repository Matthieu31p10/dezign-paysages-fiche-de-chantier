
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';
import { ArrowLeft, Edit, Trash, FileText, Mail } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ProjectInfo, WorkLog } from '@/types/models';

interface WorkLogHeaderProps {
  workLog: WorkLog;
  project?: ProjectInfo;
  handleDeleteWorkLog: () => void;
  handleExportToPDF: () => void;
  handleSendEmail: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  handleEditSuccess: () => void;
}

const WorkLogHeader = ({
  workLog,
  project,
  handleDeleteWorkLog,
  handleExportToPDF,
  handleSendEmail,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleEditSuccess
}: WorkLogHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => navigate('/worklogs')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <Badge variant="outline" className="bg-brand-50 text-brand-700">
            {formatDate(workLog.date)}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold mt-2">
          {project?.name || 'Chantier inconnu'}
        </h1>
        <p className="text-muted-foreground">
          Fiche de suivi du {formatDate(workLog.date)}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExportToPDF}
        >
          <FileText className="w-4 h-4 mr-2" />
          Exporter PDF
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSendEmail}
          disabled={!project?.contact?.email}
        >
          <Mail className="w-4 h-4 mr-2" />
          Envoyer par email
        </Button>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la fiche de suivi</DialogTitle>
            </DialogHeader>
            {/* We'll pass WorkLogForm as children from the parent */}
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Elle supprimera définitivement la fiche de suivi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteWorkLog}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default WorkLogHeader;
