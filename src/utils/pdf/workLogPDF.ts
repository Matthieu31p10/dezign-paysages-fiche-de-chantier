import { ProjectInfo, WorkLog, CompanyInfo, CustomTask } from '@/types/models';
import { formatDate } from '../date';
import jsPDF from 'jspdf';

interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean;
  includeWatering?: boolean;
  includeNotes?: boolean;
  includeTimeTracking?: boolean;
}

interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
  customTasks?: CustomTask[];
  pdfOptions?: PDFOptions;
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
    
    // Default options if not provided
    const options: PDFOptions = data.pdfOptions || {
      includeContactInfo: true,
      includeCompanyInfo: true,
      includePersonnel: true,
      includeTasks: true,
      includeWatering: true,
      includeNotes: true,
      includeTimeTracking: true
    };
    
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
    if (options.includeCompanyInfo && data.companyLogo) {
      try {
        // Add logo to the top left - smaller size
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, margin + 5, 25, 25);
      } catch (error) {
        console.error('Error adding company logo:', error);
      }
    }
    
    // Add company info if available - compact layout
    if (options.includeCompanyInfo && data.companyInfo) {
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
    
    // Tracking vertical position to adapt layout based on enabled options
    let currentY = margin + 40;
    
    // Add worklog details if available - optimized spacing
    if (data.workLog) {
      // Add title in right side 
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fiche de suivi', margin + 140, currentY);
      
      // Add date on left side
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date', margin + 90, currentY);
      pdf.setFontSize(9);
      pdf.text(formatDate(data.workLog.date), margin + 90, currentY + 5);
      
      currentY += 10;
      
      // Section: Fiche de suivi
      if (options.includeContactInfo && data.project) {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        
        // Add worklog header
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Fiche de suivi :', margin + 5, currentY + 5);
        
        // Draw green background for project name
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin + 70, currentY, width - 70, 8, 'F');
        
        // Add project name with white text
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Nom du chantier', margin + (width/2), currentY + 5, { align: 'center' });
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        // Project info
        pdf.text(data.project.name, margin + (width/2), currentY + 15, { align: 'center' });
        
        // Visit duration info
        pdf.text('Durée du passage', margin + 25, currentY + 23);
        pdf.text(`${data.workLog.duration} heures`, margin + 100, currentY + 23);
        
        currentY += 30;
      }
      
      // Time tracking section
      if (options.includeTimeTracking) {
        // Header with green background
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin, currentY, width, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Suivi de temps', margin + (width/2), currentY + 5, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        
        // Create time tracking table
        const timeTrackTableY = currentY + 8;
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
        
        currentY = timeTrackTableY + 24;
      }
      
      // Personnel section
      if (options.includePersonnel) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Personnel:', margin + 5, currentY);
        
        // Draw rectangle for personnel
        drawRect(margin, currentY + 2, width, 12);
        
        // Add personnel list
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(data.workLog.personnel.join(', '), margin + 5, currentY + 10);
        
        currentY += 20;
      }
      
      // Tasks performed section
      if (options.includeTasks && data.workLog?.tasksPerformed?.customTasks) {
        // Header with green background for "Travaux effectués"
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin, currentY, width, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Travaux effectués', margin + (width/2), currentY + 5, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        
        // Draw rectangle for tasks - height will depend on content
        const tasksBoxHeight = 45;
        drawRect(margin, currentY + 8, width, tasksBoxHeight);
        
        // Create a two-column layout for tasks
        const leftColumnX = margin + 5;
        const rightColumnX = margin + (width/2) + 5;
        let tasksY = currentY + 16;
        
        // Utility function to add task with checkmark
        const addTask = (label: string, isDone: boolean, x: number, y: number) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.text(label, x, y);
          
          // Add checkmark or X
          pdf.text(isDone ? '✓' : '✗', x - 5, y);
        };
        
        // Get custom tasks and split into left and right columns
        const customTaskEntries = Object.entries(data.workLog.tasksPerformed.customTasks);
        const halfLength = Math.ceil(customTaskEntries.length / 2);
        
        // Left column tasks
        let leftY = tasksY;
        for (let i = 0; i < halfLength; i++) {
          const [taskId, isDone] = customTaskEntries[i];
          // Find task name from data
          const taskName = data.customTasks?.find(t => t.id === taskId)?.name || taskId;
          
          addTask(taskName, isDone, leftColumnX, leftY);
          
          // Add progress if available
          if (isDone && data.workLog.tasksPerformed.customTasksProgress?.[taskId]) {
            leftY += 8;
            const progress = data.workLog.tasksPerformed.customTasksProgress[taskId];
            pdf.text(`Avancement: ${progress}%`, leftColumnX + 5, leftY);
            
            // Add progress bar
            const progressBarWidth = 40;
            const progressBarHeight = 2;
            const progressX = leftColumnX + 5;
            const progressY = leftY + 3;
            
            // Draw progress bar background
            pdf.setDrawColor(200, 200, 200);
            pdf.setFillColor(200, 200, 200);
            pdf.rect(progressX, progressY, progressBarWidth, progressBarHeight, 'F');
            
            // Draw progress
            pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.rect(progressX, progressY, (progressBarWidth * progress) / 100, progressBarHeight, 'F');
          }
          
          leftY += 10;
        }
        
        // Right column tasks
        let rightY = tasksY;
        for (let i = halfLength; i < customTaskEntries.length; i++) {
          const [taskId, isDone] = customTaskEntries[i];
          // Find task name from data
          const taskName = data.customTasks?.find(t => t.id === taskId)?.name || taskId;
          
          addTask(taskName, isDone, rightColumnX, rightY);
          
          // Add progress if available
          if (isDone && data.workLog.tasksPerformed.customTasksProgress?.[taskId]) {
            rightY += 8;
            const progress = data.workLog.tasksPerformed.customTasksProgress[taskId];
            pdf.text(`Avancement: ${progress}%`, rightColumnX + 5, rightY);
            
            // Add progress bar
            const progressBarWidth = 40;
            const progressBarHeight = 2;
            const progressX = rightColumnX + 5;
            const progressY = rightY + 3;
            
            // Draw progress bar background
            pdf.setDrawColor(200, 200, 200);
            pdf.setFillColor(200, 200, 200);
            pdf.rect(progressX, progressY, progressBarWidth, progressBarHeight, 'F');
            
            // Draw progress
            pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.rect(progressX, progressY, (progressBarWidth * progress) / 100, progressBarHeight, 'F');
          }
          
          rightY += 10;
        }
        
        // Add watering status at the bottom of tasks section
        const wateringStatus = 
          data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
          data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
        
        const maxY = Math.max(leftY, rightY);
        pdf.text(`Arrosage: ${wateringStatus}`, rightColumnX, maxY);
        
        currentY += 8 + tasksBoxHeight;
      }
      
      // Watering section
      if (options.includeWatering) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Arrosages:', margin + 5, currentY);
        
        // Draw rectangle for watering
        drawRect(margin, currentY + 2, width, 12);
        
        // Add watering info
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        
        const wateringStatus = 
          data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
          data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
        
        pdf.text(wateringStatus, margin + 5, currentY + 9);
        
        // Add water consumption if available
        if (data.workLog.waterConsumption !== undefined) {
          pdf.text(`Consommation d'eau: ${data.workLog.waterConsumption} m³`, margin + 100, currentY + 9);
        }
        
        currentY += 18;
      }
      
      // Notes section
      if (options.includeNotes) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Notes et Observations:', margin + 5, currentY);
        
        // Calculate remaining space to bottom of page
        const remainingSpace = 267 - (currentY - margin);
        
        // Draw rectangle for notes - use available space
        drawRect(margin, currentY + 2, width, remainingSpace - 5);
        
        // Add notes if available
        if (data.workLog.notes) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          // Split notes into multiple lines if needed
          const textLines = pdf.splitTextToSize(data.workLog.notes, width - 10);
          pdf.text(textLines, margin + 5, currentY + 9);
        }
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
