import { ProjectInfo, WorkLog, CompanyInfo } from '@/types/models';
import { formatDate } from './helpers';
import jsPDF from 'jspdf';

interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
}

// This function handles PDF generation for work logs
export const generatePDF = async (data: PDFData): Promise<string> => {
  console.log('Generating PDF with data:', data);
  
  try {
    // In a real implementation, we would create a PDF using jsPDF
    const pdf = new jsPDF();
    
    // Add company logo if available
    if (data.companyLogo) {
      // This is a placeholder for logo implementation
      console.log('Would add company logo:', data.companyLogo);
    }
    
    // Add company info if available
    if (data.companyInfo) {
      pdf.setFontSize(16);
      pdf.text(data.companyInfo.name, 20, 20);
      pdf.setFontSize(10);
      pdf.text(data.companyInfo.address, 20, 30);
      pdf.text(`${data.companyInfo.managerName} - ${data.companyInfo.phone}`, 20, 35);
      pdf.text(data.companyInfo.email, 20, 40);
    }
    
    // Add worklog details if available
    if (data.workLog && data.project) {
      pdf.setFontSize(14);
      pdf.text(`Fiche de suivi - ${data.project.name}`, 20, 50);
      pdf.setFontSize(10);
      pdf.text(`Date: ${formatDate(data.workLog.date)}`, 20, 60);
      pdf.text(`Durée: ${data.workLog.duration} heures`, 20, 65);
      pdf.text(`Personnel: ${data.workLog.personnel.join(', ')}`, 20, 70);
      
      // Add time tracking
      pdf.text('Suivi du temps:', 20, 80);
      pdf.text(`Départ: ${data.workLog.timeTracking.departure}`, 30, 85);
      pdf.text(`Arrivée: ${data.workLog.timeTracking.arrival}`, 30, 90);
      if (data.endTime) {
        pdf.text(`Heure de fin: ${data.endTime}`, 30, 95);
      }
      pdf.text(`Pause: ${data.workLog.timeTracking.breakTime} heures`, 30, 100);
      pdf.text(`Total: ${data.workLog.timeTracking.totalHours.toFixed(2)} heures`, 30, 105);
      
      // Add tasks
      pdf.text('Travaux effectués:', 20, 115);
      pdf.text(`Tonte: ${data.workLog.tasksPerformed.mowing ? 'Oui' : 'Non'}`, 30, 120);
      pdf.text(`Débroussailleuse: ${data.workLog.tasksPerformed.brushcutting ? 'Oui' : 'Non'}`, 30, 125);
      pdf.text(`Souffleur: ${data.workLog.tasksPerformed.blower ? 'Oui' : 'Non'}`, 30, 130);
      pdf.text(`Désherbage manuel: ${data.workLog.tasksPerformed.manualWeeding ? 'Oui' : 'Non'}`, 30, 135);
      pdf.text(`Vinaigre blanc: ${data.workLog.tasksPerformed.whiteVinegar ? 'Oui' : 'Non'}`, 30, 140);
      
      // Add pruning info
      pdf.text(`Taille: ${data.workLog.tasksPerformed.pruning.done ? 'Oui' : 'Non'}`, 30, 145);
      if (data.workLog.tasksPerformed.pruning.done) {
        pdf.text(`Avancement: ${data.workLog.tasksPerformed.pruning.progress}%`, 40, 150);
      }
      
      // Add watering info
      pdf.text(`Arrosage: ${
        data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
        data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé'
      }`, 30, 155);
      
      // Add water consumption if available
      if (data.workLog.waterConsumption !== undefined) {
        pdf.text(`Consommation d'eau: ${data.workLog.waterConsumption} m³`, 30, 160);
      }
      
      // Add notes if available
      if (data.workLog.notes) {
        pdf.text('Notes et observations:', 20, 170);
        
        // Split notes into multiple lines if needed
        const textLines = pdf.splitTextToSize(data.workLog.notes, 160);
        pdf.text(textLines, 20, 175);
      }
    }
    
    // Save the PDF (in a real implementation)
    const fileName = `WorkLog_${Date.now()}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Keep existing functions
export const generateProjectPDF = async (project: ProjectInfo, workLogs: WorkLog[] = []): Promise<string> => {
  // In a real implementation, this would create and return a PDF
  console.log('Generating PDF for project:', project.name);
  
  // This would be replaced with actual PDF creation and download
  return `Project_${project.name}_${Date.now()}.pdf`;
};

export const generateWorkLogPDF = async (workLog: WorkLog, project?: ProjectInfo): Promise<string> => {
  // In a real implementation, this would create and return a PDF
  console.log('Generating PDF for worklog:', formatDate(workLog.date));
  
  // This would be replaced with actual PDF creation and download
  return `WorkLog_${formatDate(workLog.date)}_${Date.now()}.pdf`;
};

export const generateReportPDF = async (projects: ProjectInfo[], workLogs: WorkLog[]): Promise<string> => {
  // In a real implementation, this would create and return a PDF
  console.log('Generating PDF report for', projects.length, 'projects');
  
  // This would be replaced with actual PDF creation and download
  return `Report_${Date.now()}.pdf`;
};
