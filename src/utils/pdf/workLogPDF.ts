
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
    
    // Define margins and positions
    const margin = 20;
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
    drawRect(margin, margin, width, 257);
    
    // Add company logo if available
    if (data.companyLogo) {
      try {
        // Add logo to the top left
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, margin + 5, 30, 30);
      } catch (error) {
        console.error('Error adding company logo:', error);
      }
    }
    
    // Add company info if available
    if (data.companyInfo) {
      // Company name on right side in italic
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11);
      pdf.text('Nom entreprise :', margin + 110, margin + 10, { align: 'right' });
      
      // Company info on right side
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(data.companyInfo.name, margin + 115, margin + 10);
      
      // Address
      pdf.setFont('helvetica', 'italic');
      pdf.text('Adresse :', margin + 110, margin + 17, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.address, margin + 115, margin + 17);
      
      // Manager name
      pdf.setFont('helvetica', 'italic');
      pdf.text('Nom et prénom du gérant :', margin + 110, margin + 24, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.managerName, margin + 115, margin + 24);
      
      // Phone
      pdf.setFont('helvetica', 'italic');
      pdf.text('Téléphone :', margin + 110, margin + 31, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.phone, margin + 115, margin + 31);
      
      // Email
      pdf.setFont('helvetica', 'italic');
      pdf.text('Email :', margin + 110, margin + 38, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.email, margin + 115, margin + 38);
    }
    
    // Add worklog details if available
    if (data.workLog && data.project) {
      // Add title in right side
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fiche de suivi', margin + 140, margin + 50);
      
      // Add date on left side
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Dates', margin + 90, margin + 50);
      pdf.setFontSize(10);
      pdf.text(formatDate(data.workLog.date), margin + 90, margin + 57);
      
      // Section: Fiche de suivi
      const sectionY = margin + 65;
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      
      // Add worklog header
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Fiche de suivi :', margin + 5, sectionY + 7);
      
      // Draw green background for project name
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin + 70, sectionY, width - 70, 10, 'F');
      
      // Add project name with white text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Nom du chantier', margin + (width/2), sectionY + 7, { align: 'center' });
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      // Project info
      pdf.text(data.project.name, margin + (width/2), sectionY + 17, { align: 'center' });
      
      // Visit duration info
      pdf.text('Durée du passage', margin + 25, sectionY + 27);
      pdf.text(`${data.workLog.duration} heures`, margin + 100, sectionY + 27);
      
      // Time tracking section
      const timeTrackingY = sectionY + 35;
      
      // Header with green background
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, timeTrackingY, width, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Suivi de temps', margin + (width/2), timeTrackingY + 7, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Create time tracking table
      const timeTrackTableY = timeTrackingY + 10;
      const colWidth = width / 4;
      
      // Draw table borders
      drawRect(margin, timeTrackTableY, width, 20);
      
      // Draw vertical lines
      for (let i = 1; i < 4; i++) {
        pdf.line(margin + (colWidth * i), timeTrackTableY, margin + (colWidth * i), timeTrackTableY + 20);
      }
      
      // Draw horizontal line
      pdf.line(margin, timeTrackTableY + 10, margin + width, timeTrackTableY + 10);
      
      // Time tracking header
      pdf.setFont('helvetica', 'bold');
      pdf.text('Départ', margin + (colWidth / 2), timeTrackTableY + 7, { align: 'center' });
      pdf.text('Arrivée', margin + (colWidth / 2) + colWidth, timeTrackTableY + 7, { align: 'center' });
      pdf.text('Fin', margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 7, { align: 'center' });
      pdf.text('Pause', margin + (colWidth / 2) + (colWidth * 3), timeTrackTableY + 7, { align: 'center' });
      
      // Time tracking values
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.workLog.timeTracking.departure, margin + (colWidth / 2), timeTrackTableY + 17, { align: 'center' });
      pdf.text(data.workLog.timeTracking.arrival, margin + (colWidth / 2) + colWidth, timeTrackTableY + 17, { align: 'center' });
      
      if (data.endTime) {
        pdf.text(data.endTime, margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 17, { align: 'center' });
      } else {
        pdf.text('--:--', margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 17, { align: 'center' });
      }
      
      pdf.text(`${data.workLog.timeTracking.breakTime} h`, margin + (colWidth / 2) + (colWidth * 3), timeTrackTableY + 17, { align: 'center' });
      
      // Personnel section
      const personnelY = timeTrackTableY + 30;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Personnel:', margin + 5, personnelY);
      
      // Draw rectangle for personnel
      drawRect(margin, personnelY + 3, width, 15);
      
      // Add personnel list
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.workLog.personnel.join(', '), margin + 5, personnelY + 13);
      
      // Tasks performed section
      const tasksY = personnelY + 28;
      
      // Header with green background
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, tasksY, width, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Travaux effectué', margin + (width/2), tasksY + 7, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Draw rectangle for tasks
      drawRect(margin, tasksY + 10, width, 40);
      
      // Add tasks performed
      pdf.setFont('helvetica', 'normal');
      let taskY = tasksY + 20;
      const tasksPerformed = [];
      
      if (data.workLog.tasksPerformed.mowing) tasksPerformed.push('Tonte');
      if (data.workLog.tasksPerformed.brushcutting) tasksPerformed.push('Débroussailleuse');
      if (data.workLog.tasksPerformed.blower) tasksPerformed.push('Souffleur');
      if (data.workLog.tasksPerformed.manualWeeding) tasksPerformed.push('Désherbage manuel');
      if (data.workLog.tasksPerformed.whiteVinegar) tasksPerformed.push('Vinaigre blanc');
      if (data.workLog.tasksPerformed.pruning.done) tasksPerformed.push(`Taille (avancement: ${data.workLog.tasksPerformed.pruning.progress}%)`);
      
      // Add tasks in two columns
      const colMaxItems = Math.ceil(tasksPerformed.length / 2);
      for (let i = 0; i < tasksPerformed.length; i++) {
        const xPos = i < colMaxItems ? margin + 5 : margin + (width / 2) + 5;
        const yPos = i < colMaxItems ? taskY + (i * 7) : taskY + ((i - colMaxItems) * 7);
        pdf.text(`• ${tasksPerformed[i]}`, xPos, yPos);
      }
      
      // Watering section
      const wateringY = tasksY + 60;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Arrosages:', margin + 5, wateringY);
      
      // Draw rectangle for watering
      drawRect(margin, wateringY + 3, width, 15);
      
      // Add watering info
      pdf.setFont('helvetica', 'normal');
      const wateringStatus = 
        data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
        data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
        
      pdf.text(wateringStatus, margin + 5, wateringY + 13);
      
      // Add water consumption if available
      if (data.workLog.waterConsumption !== undefined) {
        pdf.text(`Consommation d'eau: ${data.workLog.waterConsumption} m³`, margin + 100, wateringY + 13);
      }
      
      // Notes section
      const notesY = wateringY + 28;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes et Observation:', margin + 5, notesY);
      
      // Draw rectangle for notes
      drawRect(margin, notesY + 3, width, 40);
      
      // Add notes if available
      if (data.workLog.notes) {
        pdf.setFont('helvetica', 'normal');
        // Split notes into multiple lines if needed
        const textLines = pdf.splitTextToSize(data.workLog.notes, width - 10);
        pdf.text(textLines, margin + 5, notesY + 13);
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
