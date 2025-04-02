
import { ProjectInfo, WorkLog, CompanyInfo } from '@/types/models';
import { formatDate } from '../helpers';
import jsPDF from 'jspdf';

interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
}

// This function handles PDF generation for work logs
export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  console.log('Generating PDF with data:', data);
  
  try {
    // Initialize PDF with A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Define colors (green color similar to the image template)
    const primaryColor = [141, 198, 63];
    const primaryColorHex = '#8dc63f';
    
    // Define margins and positions - reduced for better space usage
    const margin = 15;
    const width = 210 - (margin * 2);
    
    // Function to draw borders around tables and sections
    const drawRect = (x: number, y: number, w: number, h: number, color?: number[]) => {
      if (color) {
        pdf.setDrawColor(color[0], color[1], color[2]);
      } else {
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      }
      pdf.rect(x, y, w, h, 'S');
    };
    
    // Draw the outer border (green rectangle)
    drawRect(margin, margin, width, 267);
    
    // Add company logo if available - smaller size
    if (data.companyLogo) {
      try {
        // Add logo to the top left - smaller size
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, margin + 5, 25, 25);
      } catch (error) {
        console.error('Error adding company logo:', error);
      }
    }
    
    // Add company info if available - compact layout
    if (data.companyInfo) {
      // Company info on right side - reduced font sizes and spacing
      const infoStartX = margin + 100;
      pdf.setFontSize(9);
      
      // Company name
      pdf.setFont('helvetica', 'italic');
      pdf.text('Nom entreprise :', infoStartX, margin + 10, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.name, infoStartX + 5, margin + 10);
      
      // Address
      pdf.setFont('helvetica', 'italic');
      pdf.text('Adresse :', infoStartX, margin + 15, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.address, infoStartX + 5, margin + 15);
      
      // Manager name
      pdf.setFont('helvetica', 'italic');
      pdf.text('Gérant :', infoStartX, margin + 20, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.managerName, infoStartX + 5, margin + 20);
      
      // Phone
      pdf.setFont('helvetica', 'italic');
      pdf.text('Téléphone :', infoStartX, margin + 25, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.phone, infoStartX + 5, margin + 25);
      
      // Email
      pdf.setFont('helvetica', 'italic');
      pdf.text('Email :', infoStartX, margin + 30, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.email, infoStartX + 5, margin + 30);
    }
    
    // Add worklog details if available - optimized spacing
    if (data.workLog && data.project) {
      // Add title in right side - moved up
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fiche de suivi', margin + 140, margin + 40);
      
      // Add date on left side - moved up
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date', margin + 90, margin + 40);
      pdf.setFontSize(9);
      pdf.text(formatDate(data.workLog.date), margin + 90, margin + 45);
      
      // Section: Fiche de suivi - moved up
      const sectionY = margin + 50;
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      
      // Add worklog header - reduced size
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Fiche de suivi :', margin + 5, sectionY + 5);
      
      // Draw green background for project name
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin + 70, sectionY, width - 70, 8, 'F');
      
      // Add project name with white text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Nom du chantier', margin + (width/2), sectionY + 5, { align: 'center' });
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      // Project info - moved up
      pdf.text(data.project.name, margin + (width/2), sectionY + 15, { align: 'center' });
      
      // Visit duration info - compact layout
      pdf.text('Durée du passage', margin + 25, sectionY + 23);
      pdf.text(`${data.workLog.duration} heures`, margin + 100, sectionY + 23);
      
      // Time tracking section - moved up
      const timeTrackingY = sectionY + 30;
      
      // Header with green background - reduced height
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, timeTrackingY, width, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Suivi de temps', margin + (width/2), timeTrackingY + 5, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Create time tracking table - reduced height
      const timeTrackTableY = timeTrackingY + 8;
      const colWidth = width / 4;
      
      // Draw table borders
      drawRect(margin, timeTrackTableY, width, 16);
      
      // Draw vertical lines
      for (let i = 1; i < 4; i++) {
        pdf.line(margin + (colWidth * i), timeTrackTableY, margin + (colWidth * i), timeTrackTableY + 16);
      }
      
      // Draw horizontal line
      pdf.line(margin, timeTrackTableY + 8, margin + width, timeTrackTableY + 8);
      
      // Time tracking header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text('Départ', margin + (colWidth / 2), timeTrackTableY + 5, { align: 'center' });
      pdf.text('Arrivée', margin + (colWidth / 2) + colWidth, timeTrackTableY + 5, { align: 'center' });
      pdf.text('Fin', margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 5, { align: 'center' });
      pdf.text('Pause', margin + (colWidth / 2) + (colWidth * 3), timeTrackTableY + 5, { align: 'center' });
      
      // Time tracking values
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.workLog.timeTracking.departure, margin + (colWidth / 2), timeTrackTableY + 13, { align: 'center' });
      pdf.text(data.workLog.timeTracking.arrival, margin + (colWidth / 2) + colWidth, timeTrackTableY + 13, { align: 'center' });
      
      if (data.endTime) {
        pdf.text(data.endTime, margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 13, { align: 'center' });
      } else {
        pdf.text('--:--', margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 13, { align: 'center' });
      }
      
      pdf.text(`${data.workLog.timeTracking.breakTime} h`, margin + (colWidth / 2) + (colWidth * 3), timeTrackTableY + 13, { align: 'center' });
      
      // Personnel section - moved up and reduced
      const personnelY = timeTrackTableY + 24;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('Personnel:', margin + 5, personnelY);
      
      // Draw rectangle for personnel - reduced height
      drawRect(margin, personnelY + 2, width, 12);
      
      // Add personnel list
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(data.workLog.personnel.join(', '), margin + 5, personnelY + 10);
      
      // Tasks performed section - moved up and added a dedicated section
      const tasksY = personnelY + 20;
      
      // Header with green background for "Travaux effectués"
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, tasksY, width, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('Travaux effectués', margin + (width/2), tasksY + 5, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Draw rectangle for tasks - increased height to fit more content
      drawRect(margin, tasksY + 8, width, 45);
      
      // Create a two-column layout for tasks
      const leftColumnX = margin + 5;
      const rightColumnX = margin + (width/2) + 5;
      let currentY = tasksY + 16;
      
      // Utility function to add task with checkmark
      const addTask = (label: string, isDone: boolean, x: number, y: number) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(label, x, y);
        
        // Add checkmark or X
        pdf.text(isDone ? '✓' : '✗', x - 5, y);
      };
      
      // Add all tasks in left column
      addTask('Tonte', data.workLog.tasksPerformed.mowing, leftColumnX, currentY);
      currentY += 8;
      addTask('Débroussailleuse', data.workLog.tasksPerformed.brushcutting, leftColumnX, currentY);
      currentY += 8;
      addTask('Souffleur', data.workLog.tasksPerformed.blower, leftColumnX, currentY);
      currentY += 8;
      addTask('Désherbage manuel', data.workLog.tasksPerformed.manualWeeding, leftColumnX, currentY);
      
      // Reset Y for right column
      currentY = tasksY + 16;
      
      // Add tasks in right column
      addTask('Vinaigre blanc', data.workLog.tasksPerformed.whiteVinegar, rightColumnX, currentY);
      currentY += 8;
      
      // Add pruning with progress if done
      addTask('Taille', data.workLog.tasksPerformed.pruning.done, rightColumnX, currentY);
      
      if (data.workLog.tasksPerformed.pruning.done) {
        currentY += 8;
        pdf.text(`Avancement: ${data.workLog.tasksPerformed.pruning.progress}%`, rightColumnX + 5, currentY);
        
        // Add progress bar
        const progressBarWidth = 40;
        const progressBarHeight = 2;
        const progressX = rightColumnX + 5;
        const progressY = currentY + 3;
        
        // Draw progress bar background
        pdf.setDrawColor(200, 200, 200);
        pdf.setFillColor(200, 200, 200);
        pdf.rect(progressX, progressY, progressBarWidth, progressBarHeight, 'F');
        
        // Draw progress
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(progressX, progressY, (progressBarWidth * data.workLog.tasksPerformed.pruning.progress) / 100, progressBarHeight, 'F');
      }
      
      currentY += 16;
      
      // Add watering status
      const wateringStatus = 
        data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
        data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
      
      pdf.text(`Arrosage: ${wateringStatus}`, rightColumnX, currentY);
      
      // Watering section moved down after tasks performed
      const wateringY = tasksY + 55;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('Arrosages:', margin + 5, wateringY);
      
      // Draw rectangle for watering - reduced height
      drawRect(margin, wateringY + 2, width, 12);
      
      // Add watering info
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      
      pdf.text(wateringStatus, margin + 5, wateringY + 9);
      
      // Add water consumption if available
      if (data.workLog.waterConsumption !== undefined) {
        pdf.text(`Consommation d'eau: ${data.workLog.waterConsumption} m³`, margin + 100, wateringY + 9);
      }
      
      // Notes section - moved down and adjusted height
      const notesY = wateringY + 18;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('Notes et Observations:', margin + 5, notesY);
      
      // Calculate remaining space to bottom of page
      const remainingSpace = 267 - (notesY - margin);
      
      // Draw rectangle for notes - use available space
      drawRect(margin, notesY + 2, width, remainingSpace - 5);
      
      // Add notes if available
      if (data.workLog.notes) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        // Split notes into multiple lines if needed
        const textLines = pdf.splitTextToSize(data.workLog.notes, width - 10);
        pdf.text(textLines, margin + 5, notesY + 9);
      }
    }
    
    // Save the PDF (in a real implementation)
    const fileName = `Fiche_Suivi_${data.project?.name}_${formatDate(data.workLog?.date || new Date())}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
