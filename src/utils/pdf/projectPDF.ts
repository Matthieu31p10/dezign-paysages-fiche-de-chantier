
import { ProjectInfo, WorkLog } from '@/types/models';
import { formatDate } from '../date';
import jsPDF from 'jspdf';

/**
 * Generate a PDF for a specific project with optional work logs
 */
export const generateProjectPDF = async (project: ProjectInfo, workLogs: WorkLog[] = []): Promise<string> => {
  console.log('Generating PDF for project:', project.name);
  
  try {
    // Initialize the PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add project title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Projet: ${project.name}`, 20, 20);
    
    // Add project details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Adresse: ${project.address}`, 20, 30);
    
    if (project.contact.name) {
      pdf.text(`Contact: ${project.contact.name}`, 20, 40);
    }
    
    pdf.text(`Téléphone: ${project.contact.phone}`, 20, 50);
    pdf.text(`Email: ${project.contact.email}`, 20, 60);
    
    // Add contract details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détails du contrat', 20, 75);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Visites annuelles: ${project.annualVisits}`, 20, 85);
    pdf.text(`Heures annuelles totales: ${project.annualTotalHours}`, 20, 95);
    pdf.text(`Durée des visites: ${project.visitDuration} heures`, 20, 105);
    
    // Add work logs if included
    if (workLogs.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fiches de suivi', 20, 120);
      pdf.setFont('helvetica', 'normal');
      
      const headers = ['Date', 'Durée', 'Personnel', 'Tâches principales'];
      const rows = workLogs.map(log => {
        const tasks = [];
        const tasksPerformed = log.tasksPerformed || {};
        
        if (tasksPerformed.mowing) tasks.push('Tonte');
        if (tasksPerformed.brushcutting) tasks.push('Débroussaillage');
        if (tasksPerformed.pruning?.done) tasks.push('Taille');
        
        return [
          formatDate(log.date),
          `${log.duration}h`,
          log.personnel.join(', '),
          tasks.join(', ')
        ];
      });
      
      // Draw table
      const startY = 130;
      const cellPadding = 4;
      const colWidths = [30, 20, 70, 60];
      const rowHeight = 10;
      
      // Draw headers
      pdf.setFont('helvetica', 'bold');
      headers.forEach((header, i) => {
        let x = 20;
        for (let j = 0; j < i; j++) {
          x += colWidths[j];
        }
        pdf.text(header, x + cellPadding, startY);
      });
      
      // Draw rows
      pdf.setFont('helvetica', 'normal');
      rows.forEach((row, rowIndex) => {
        const y = startY + ((rowIndex + 1) * rowHeight);
        
        row.forEach((cell, cellIndex) => {
          let x = 20;
          for (let j = 0; j < cellIndex; j++) {
            x += colWidths[j];
          }
          pdf.text(cell, x + cellPadding, y);
        });
      });
    }
    
    // Save the PDF
    const fileName = `Projet_${project.name}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating project PDF:', error);
    throw error;
  }
};
