import { ProjectInfo, WorkLog } from '@/types/models';
import { formatDate } from '../date';
import jsPDF from 'jspdf';
import { calculateWaterConsumptionStats } from '../statistics';

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
    
    // Calculate total team hours worked
    const totalTeamHours = workLogs.reduce((sum, log) => {
      const individualHours = log.timeTracking.totalHours;
      const personnelCount = log.personnel?.length || 1;
      return sum + (individualHours * personnelCount);
    }, 0);
    
    pdf.text(`Heures totales travaillées (équipe): ${totalTeamHours.toFixed(2)}h`, 20, 60);
    
    // Add projects summary (one per page)
    let currentY = 80;
    const maxY = 270; // Max height for A4 before needing new page
    
    projects.forEach((project, index) => {
      if (currentY > maxY) {
        pdf.addPage();
        currentY = 20;
      }
      
      const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
      
      // Calculer le temps total équipe pour ce projet
      const projectTotalTeamHours = projectWorkLogs.reduce((sum, log) => {
        const individualHours = log.timeTracking.totalHours;
        const personnelCount = log.personnel?.length || 1;
        return sum + (individualHours * personnelCount);
      }, 0);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${project.name}`, 20, currentY);
      currentY += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Visites: ${projectWorkLogs.length}/${project.annualVisits}`, 25, currentY);
      currentY += 7;
      
      pdf.text(`Heures travaillées (équipe): ${projectTotalTeamHours.toFixed(2)}h / ${project.annualTotalHours}h`, 25, currentY);
      currentY += 7;
      
      if (projectWorkLogs.length > 0) {
        const lastVisit = new Date(Math.max(...projectWorkLogs.map(log => new Date(log.date).getTime())));
        pdf.text(`Dernière visite: ${formatDate(lastVisit)}`, 25, currentY);
        currentY += 7;
      } else {
        pdf.text('Aucune visite enregistrée', 25, currentY);
        currentY += 7;
      }
      
      // Add water consumption data if project has irrigation
      if (project.irrigation === 'irrigation') {
        const waterStats = calculateWaterConsumptionStats(projectWorkLogs);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bilan de consommation d\'eau:', 25, currentY);
        currentY += 7;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Consommation totale: ${waterStats.totalConsumption} m³`, 30, currentY);
        currentY += 7;
        
        if (waterStats.lastReading) {
          pdf.text(`Dernier relevé: ${formatDate(waterStats.lastReading.date)} - ${waterStats.lastReading.consumption} m³`, 30, currentY);
          currentY += 7;
        }
        
        if (waterStats.monthlyConsumption.length > 0) {
          pdf.text('Consommation mensuelle:', 30, currentY);
          currentY += 5;
          
          waterStats.monthlyConsumption.forEach(monthly => {
            const monthName = new Date(2023, monthly.month, 1).toLocaleString('fr-FR', { month: 'long' });
            pdf.text(`- ${monthName}: ${monthly.consumption} m³`, 35, currentY);
            currentY += 5;
          });
          
          currentY += 2;
        }
      }
      
      currentY += 8;
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
