
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { MapPin } from 'lucide-react';

// Import refactored components
import ProjectDetailHeader from './detail/ProjectDetailHeader';
import ProjectDetailsTab from './detail/ProjectDetailsTab';
import ProjectWorkLogsTab from './detail/ProjectWorkLogsTab';
import ProjectEditDialog from './detail/ProjectEditDialog';
import ProjectDeleteDialog from './detail/ProjectDeleteDialog';
import ProjectNotFound from './detail/ProjectNotFound';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, getWorkLogsByProjectId, deleteProjectInfo, teams } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const project = getProjectById(id!);
  const workLogs = getWorkLogsByProjectId(id!);
  
  if (!project) {
    return <ProjectNotFound />;
  }
  
  const teamName = teams.find(team => team.id === project.team)?.name || 'Équipe non assignée';
  
  const handleDeleteProject = () => {
    deleteProjectInfo(project.id);
    navigate('/projects');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };
  
  // Fix the icon in DetailHeader
  const ProjectDetailHeaderWithIcon = () => (
    <ProjectDetailHeader
      project={{...project, address: project.address}} // Pass address explicitly
      teamName={teamName}
      setIsEditDialogOpen={setIsEditDialogOpen}
      onDeleteClick={handleDeleteProject}
      isEditDialogOpen={isEditDialogOpen}
    />
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ProjectDetailHeader
        project={project}
        teamName={teamName}
        setIsEditDialogOpen={setIsEditDialogOpen}
        onDeleteClick={handleDeleteProject}
        isEditDialogOpen={isEditDialogOpen}
      />
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Informations</TabsTrigger>
          <TabsTrigger value="worklogs">Fiches de suivi ({workLogs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <ProjectDetailsTab project={project} teamName={teamName} />
        </TabsContent>
        
        <TabsContent value="worklogs" className="pt-4">
          <ProjectWorkLogsTab project={project} workLogs={workLogs} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ProjectEditDialog project={project} onSuccess={handleEditSuccess} />
      </Dialog>
      
      <AlertDialog>
        <ProjectDeleteDialog onDeleteConfirm={handleDeleteProject} />
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
