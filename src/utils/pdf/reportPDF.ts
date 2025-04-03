
import { ProjectInfo, WorkLog } from '@/types/models';
import { formatDate } from '../date';
import jsPDF from 'jspdf';

/**
 * Generate a comprehensive report PDF with all projects and work logs
 */
export const generateReportPDF = async (projects: ProjectInfo[], workLogs: WorkLog[]): Promise<string> => {
  console.log('Generating PDF report for', projects.length, 'projects');
  
  try {
    // Initialize the PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Rapport complet des chantiers', 20, 20);
    
    // Add date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Généré le: ${formatDate(new Date())}`, 20, 30);
    
    // Add project count
    pdf.text(`Nombre de chantiers: ${projects.length}`, 20, 40);
    pdf.text(`Nombre de fiches de suivi: ${workLogs.length}`, 20, 50);
    
    // Calculate total hours worked
    const totalHours = workLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
    pdf.text(`Heures totales travaillées: ${totalHours.toFixed(2)}h`, 20, 60);
    
    // Calculate total water consumption
    const totalWaterConsumption = workLogs.reduce((sum, log) => {
      return sum + (log.waterConsumption || 0);
    }, 0);
    
    if (totalWaterConsumption > 0) {
      pdf.text(`Consommation d'eau totale: ${totalWaterConsumption.toFixed(2)}m³`, 20, 70);
    }
    
    // Add projects summary (one per page)
    let currentY = 80;
    const maxY = 270; // Max height for A4 before needing new page
    
    projects.forEach((project, index) => {
      if (currentY > maxY) {
        pdf.addPage();
        currentY = 20;
      }
      
      const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
      const projectTotalHours = projectWorkLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${project.name}`, 20, currentY);
      currentY += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Visites: ${projectWorkLogs.length}/${project.annualVisits}`, 25, currentY);
      currentY += 7;
      
      pdf.text(`Heures travaillées: ${projectTotalHours.toFixed(2)}h / ${project.annualTotalHours}h`, 25, currentY);
      currentY += 7;
      
      // Add water consumption if relevant
      if (project.irrigation === 'irrigation') {
        const projectWaterConsumption = projectWorkLogs.reduce((sum, log) => {
          return sum + (log.waterConsumption || 0);
        }, 0);
        
        if (projectWaterConsumption > 0) {
          pdf.text(`Consommation d'eau: ${projectWaterConsumption.toFixed(2)}m³`, 25, currentY);
          currentY += 7;
        }
      }
      
      if (projectWorkLogs.length > 0) {
        const lastVisit = new Date(Math.max(...projectWorkLogs.map(log => new Date(log.date).getTime())));
        pdf.text(`Dernière visite: ${formatDate(lastVisit)}`, 25, currentY);
      } else {
        pdf.text('Aucune visite enregistrée', 25, currentY);
      }
      
      currentY += 15;
    });
    
    // Save the PDF
    const fileName = `Rapport_Complet_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating report PDF:', error);
    throw error;
  }
};
