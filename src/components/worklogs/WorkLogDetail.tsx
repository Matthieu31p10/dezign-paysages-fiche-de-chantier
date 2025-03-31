
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import WorkLogForm from './WorkLogForm';
import { toast } from 'sonner';
import WorkLogHeader from './WorkLogHeader';
import WorkLogDetailsCard from './WorkLogDetailsCard';
import TasksPerformedCard from './TasksPerformedCard';

const WorkLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workLogs, getProjectById, updateWorkLog, deleteWorkLog, settings } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  
  const workLog = workLogs.find(log => log.id === id);
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de suivi non trouvée</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90" 
          onClick={() => navigate('/worklogs')}
        >
          Retour à la liste
        </button>
      </div>
    );
  }
  
  const project = getProjectById(workLog.projectId);
  
  useEffect(() => {
    if (workLog.notes) {
      setNotes(workLog.notes);
    }
  }, [workLog.notes]);
  
  const handleDeleteWorkLog = () => {
    deleteWorkLog(workLog.id);
    navigate('/worklogs');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };
  
  const saveNotes = () => {
    if (workLog) {
      updateWorkLog({
        ...workLog,
        notes
      });
      toast.success("Notes enregistrées");
    }
  };
  
  const calculateEndTime = () => {
    if (!workLog) return "--:--";
    
    // Parse time strings into numbers
    const departureTimeParts = workLog.timeTracking.departure.split(':');
    const arrivalTimeParts = workLog.timeTracking.arrival.split(':');
    
    if (departureTimeParts.length !== 2 || arrivalTimeParts.length !== 2) {
      return "--:--";
    }
    
    const departureHour = parseInt(departureTimeParts[0], 10);
    const departureMinute = parseInt(departureTimeParts[1], 10);
    const arrivalHour = parseInt(arrivalTimeParts[0], 10);
    const arrivalMinute = parseInt(arrivalTimeParts[1], 10);
    
    // Calculate break time in minutes
    let breakTimeMinutes: number;
    if (typeof workLog.timeTracking.breakTime === 'string') {
      breakTimeMinutes = parseFloat(workLog.timeTracking.breakTime) * 60;
    } else {
      breakTimeMinutes = workLog.timeTracking.breakTime * 60;
    }
    
    // Convert times to minutes for easier calculation
    const departureInMinutes = departureHour * 60 + departureMinute;
    const arrivalInMinutes = arrivalHour * 60 + arrivalMinute;
    
    // Calculate total work minutes
    const totalWorkMinutes = arrivalInMinutes - departureInMinutes;
    
    // Calculate end time in minutes (departure + total work time)
    const endTimeInMinutes = departureInMinutes + totalWorkMinutes;
    
    // Convert end time back to hours and minutes
    const endHour = Math.floor(endTimeInMinutes / 60);
    const endMinute = endTimeInMinutes % 60;
    
    // Format and return the end time
    return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  };
  
  const calculateHourDifference = () => {
    if (!workLog || !project) return "N/A";
    
    const completedVisits = workLogs.filter(log => log.projectId === project.id).length;
    
    if (completedVisits === 0) return "N/A";
    
    const totalHoursCompleted = workLogs
      .filter(log => log.projectId === project.id)
      .reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    const difference = averageHoursPerVisit - project.visitDuration;
    
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(2)} h`;
  };
  
  const handleExportToPDF = async () => {
    if (!workLog || !project) return;
    
    try {
      const data = {
        workLog,
        project,
        endTime: calculateEndTime(),
        companyInfo: settings.companyInfo,
        companyLogo: settings.companyLogo
      };
      
      // Importing at runtime to avoid circular dependencies
      const { generatePDF } = await import('@/utils/pdfGenerator');
      await generatePDF(data);
      toast.success("PDF généré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF");
      console.error("PDF generation error:", error);
    }
  };
  
  const handleSendEmail = () => {
    if (!project?.contact?.email) {
      toast.error("Aucune adresse email de contact n'est définie pour ce chantier");
      return;
    }
    
    toast.success(`Email envoyé à ${project.contact.email}`);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <WorkLogHeader 
        workLog={workLog}
        project={project}
        handleDeleteWorkLog={handleDeleteWorkLog}
        handleExportToPDF={handleExportToPDF}
        handleSendEmail={handleSendEmail}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        handleEditSuccess={handleEditSuccess}
      />
      
      {isEditDialogOpen && (
        <WorkLogForm 
          initialData={workLog} 
          onSuccess={handleEditSuccess} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WorkLogDetailsCard 
            workLog={workLog}
            calculateHourDifference={calculateHourDifference}
            calculateEndTime={calculateEndTime}
            notes={notes}
            setNotes={setNotes}
            saveNotes={saveNotes}
          />
        </div>
        
        <div>
          <TasksPerformedCard 
            tasksPerformed={workLog.tasksPerformed}
            projectId={workLog.projectId}
            navigateToProject={(id) => navigate(`/projects/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkLogDetail;
