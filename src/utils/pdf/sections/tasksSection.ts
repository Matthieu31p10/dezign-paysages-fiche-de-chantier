
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawTasksSection = (pdf: any, data: PDFData, margin: number, yPos: number, pageWidth: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeTasks || !data.workLog?.tasksPerformed?.customTasks) {
    return yPos;
  }
  
  yPos += 10;
  
  // Diviser la page en deux colonnes
  const leftColX = margin;
  const rightColX = margin + contentWidth/2 + 5;
  let leftColY = yPos + 10;
  let rightColY = yPos + 10;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Tâches personnalisées", pageWidth / 2, yPos, { align: 'center' });
  
  const customTasks = data.workLog.tasksPerformed.customTasks;
  const taskIds = Object.keys(customTasks);
  
  if (taskIds.length > 0) {
    taskIds.forEach((taskId, index) => {
      const done = customTasks[taskId];
      const progress = data.workLog?.tasksPerformed?.tasksProgress?.[taskId] || 0;
      
      // Determine which column to use
      const colX = index % 2 === 0 ? leftColX : rightColX;
      let currentY = index % 2 === 0 ? leftColY : rightColY;
      
      // Task name
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(sanitizeText(taskId), colX, currentY);
      
      // Status icon (check mark)
      if (done) {
        pdf.setTextColor(61, 174, 43); // Green for completed
        pdf.text("✓", colX + contentWidth/2 - 25, currentY);
      }
      pdf.setTextColor(60, 60, 60);
      
      // Progress bar
      currentY += 4;
      
      // Progress bar background
      pdf.setFillColor(220, 220, 220);
      pdf.rect(colX, currentY, contentWidth/2 - 15, 3, 'F');
      
      // Progress bar fill
      pdf.setFillColor(61, 174, 43);
      pdf.rect(colX, currentY, (contentWidth/2 - 15) * progress / 100, 3, 'F');
      
      // Progress percentage
      pdf.setFontSize(8);
      pdf.text(`${progress}%`, colX + contentWidth/2 - 12, currentY + 2.5);
      
      // Update the current Y position
      if (index % 2 === 0) {
        leftColY += 12;
      } else {
        rightColY += 12;
      }
    });
    
    yPos = Math.max(leftColY, rightColY);
  } else {
    // No custom tasks
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text("Aucune tâche personnalisée définie", margin, yPos + 15);
    yPos += 20;
  }
  
  return yPos + 10;
}
