import { ProjectInfo, WorkLog, CompanyInfo } from '@/types/models';
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
  pdfOptions?: PDFOptions;
}

export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  console.log('Generating PDF with data:', data);
  
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const primaryColor = [141, 198, 63];
    const primaryColorHex = '#8dc63f';
    
    const margin = 15;
    const width = 210 - (margin * 2);
    
    const options: PDFOptions = data.pdfOptions || {
      includeContactInfo: true,
      includeCompanyInfo: true,
      includePersonnel: true,
      includeTasks: true,
      includeWatering: true,
      includeNotes: true,
      includeTimeTracking: true
    };
    
    const drawRect = (x: number, y: number, w: number, h: number, color?: number[]) => {
      if (color) {
        pdf.setDrawColor(color[0], color[1], color[2]);
      } else {
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      }
      pdf.rect(x, y, w, h, 'S');
    };
    
    drawRect(margin, margin, width, 267);
    
    if (options.includeCompanyInfo && data.companyLogo) {
      try {
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, margin + 5, 25, 25);
      } catch (error) {
        console.error('Error adding company logo:', error);
      }
    }
    
    if (options.includeCompanyInfo && data.companyInfo) {
      const infoStartX = margin + 100;
      pdf.setFontSize(9);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Nom entreprise :', infoStartX, margin + 10, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.name, infoStartX + 5, margin + 10);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Adresse :', infoStartX, margin + 15, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.address, infoStartX + 5, margin + 15);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Gérant :', infoStartX, margin + 20, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.managerName, infoStartX + 5, margin + 20);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Téléphone :', infoStartX, margin + 25, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.phone, infoStartX + 5, margin + 25);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Email :', infoStartX, margin + 30, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.companyInfo.email, infoStartX + 5, margin + 30);
    }
    
    let currentY = margin + 40;
    
    if (data.workLog) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fiche de suivi', margin + 140, currentY);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date', margin + 90, currentY);
      pdf.setFontSize(9);
      pdf.text(formatDate(data.workLog.date), margin + 90, currentY + 5);
      
      currentY += 10;
      
      if (options.includeContactInfo && data.project) {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Fiche de suivi :', margin + 5, currentY + 5);
        
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin + 70, currentY, width - 70, 8, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Nom du chantier', margin + (width/2), currentY + 5, { align: 'center' });
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        pdf.text(data.project.name, margin + (width/2), currentY + 15, { align: 'center' });
        
        pdf.text('Durée du passage', margin + 25, currentY + 23);
        pdf.text(`${data.workLog.duration} heures`, margin + 100, currentY + 23);
        
        currentY += 30;
      }
      
      if (options.includeTimeTracking) {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin, currentY, width, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Suivi de temps', margin + (width/2), currentY + 5, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        
        const timeTrackTableY = currentY + 8;
        const colWidth = width / 4;
        
        drawRect(margin, timeTrackTableY, width, 16);
        
        for (let i = 1; i < 4; i++) {
          pdf.line(margin + (colWidth * i), timeTrackTableY, margin + (colWidth * i), timeTrackTableY + 16);
        }
        
        pdf.line(margin, timeTrackTableY + 8, margin + width, timeTrackTableY + 8);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.text('Départ', margin + (colWidth / 2), timeTrackTableY + 5, { align: 'center' });
        pdf.text('Arrivée', margin + (colWidth / 2) + colWidth, timeTrackTableY + 5, { align: 'center' });
        pdf.text('Fin', margin + (colWidth / 2) + (colWidth * 2), timeTrackTableY + 5, { align: 'center' });
        pdf.text('Pause', margin + (colWidth / 2) + (colWidth * 3), timeTrackTableY + 5, { align: 'center' });
        
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
      
      if (options.includePersonnel) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Personnel:', margin + 5, currentY);
        
        drawRect(margin, currentY + 2, width, 12);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(data.workLog.personnel.join(', '), margin + 5, currentY + 10);
        
        currentY += 20;
      }
      
      if (options.includeTasks) {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin, currentY, width, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Travaux effectués', margin + (width/2), currentY + 5, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        
        drawRect(margin, currentY + 8, width, 45);
        
        const leftColumnX = margin + 5;
        const rightColumnX = margin + (width/2) + 5;
        let tasksY = currentY + 16;
        
        const addTask = (label: string, isDone: boolean, x: number, y: number) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.text(label, x, y);
          
          pdf.text(isDone ? '✓' : '✗', x - 5, y);
        };
        
        addTask('Tonte', data.workLog.tasksPerformed.mowing, leftColumnX, tasksY);
        tasksY += 8;
        addTask('Débroussailleuse', data.workLog.tasksPerformed.brushcutting, leftColumnX, tasksY);
        tasksY += 8;
        addTask('Souffleur', data.workLog.tasksPerformed.blower, leftColumnX, tasksY);
        tasksY += 8;
        addTask('Désherbage manuel', data.workLog.tasksPerformed.manualWeeding, leftColumnX, tasksY);
        
        tasksY = currentY + 16;
        
        addTask('Vinaigre blanc', data.workLog.tasksPerformed.whiteVinegar, rightColumnX, tasksY);
        tasksY += 8;
        
        if (data.workLog.tasksPerformed.pruning.done) {
          tasksY += 8;
          pdf.text(`Avancement: ${data.workLog.tasksPerformed.pruning.progress}%`, rightColumnX + 5, tasksY);
          
          const progressBarWidth = 40;
          const progressBarHeight = 2;
          const progressX = rightColumnX + 5;
          const progressY = tasksY + 3;
          
          pdf.setDrawColor(200, 200, 200);
          pdf.setFillColor(200, 200, 200);
          pdf.rect(progressX, progressY, progressBarWidth, progressBarHeight, 'F');
          
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.rect(progressX, progressY, (progressBarWidth * data.workLog.tasksPerformed.pruning.progress) / 100, progressBarHeight, 'F');
        }
        
        tasksY += 16;
        
        const wateringStatus = 
          data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
          data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
        
        pdf.text(`Arrosage: ${wateringStatus}`, rightColumnX, tasksY);
        
        currentY += 8 + tasksHeight;
      }
      
      if (options.includeWatering) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Arrosages:', margin + 5, currentY);
        
        drawRect(margin, currentY + 2, width, 20);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        
        const wateringStatus = 
          data.workLog?.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
          data.workLog?.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
        
        pdf.text(wateringStatus, margin + 5, currentY + 9);
        
        if (data.workLog?.waterConsumption !== undefined) {
          pdf.text(`Consommation d'eau: ${data.workLog.waterConsumption} m³`, margin + 100, currentY + 9);
          
          const previousReadings = data.project ? 
            data.project.name + " - Historique consommation d'eau" : 
            "Historique consommation";
            
          pdf.text(previousReadings, margin + 5, currentY + 17);
        }
        
        currentY += 26;
      }
      
      if (options.includeNotes) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('Notes et Observations:', margin + 5, currentY);
        
        const remainingSpace = 267 - (currentY - margin);
        
        drawRect(margin, currentY + 2, width, remainingSpace - 5);
        
        if (data.workLog.notes) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          const textLines = pdf.splitTextToSize(data.workLog.notes, width - 10);
          pdf.text(textLines, margin + 5, currentY + 9);
        }
      }
    }
    
    const fileName = `Fiche_Suivi_${data.project?.name}_${formatDate(data.workLog?.date || new Date())}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
