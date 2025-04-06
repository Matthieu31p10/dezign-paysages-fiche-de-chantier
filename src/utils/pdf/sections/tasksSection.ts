
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawTasksSection = (pdf: any, data: PDFData, margin: number, yPos: number, pageWidth: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeTasks || !data.workLog?.tasksPerformed?.customTasks) {
    return yPos;
  }
  
  yPos += 8; // Réduire l'espace avant cette section
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Tâches personnalisées", margin, yPos);
  
  const customTasks = data.workLog.tasksPerformed.customTasks;
  const taskIds = Object.keys(customTasks);
  
  if (taskIds.length > 0) {
    // Utiliser 3 colonnes au lieu de 2 pour mieux utiliser l'espace
    const colWidth = contentWidth / 3;
    
    yPos += 8;
    
    // Déterminer combien de tâches par colonne
    const tasksPerColumn = Math.ceil(taskIds.length / 3);
    
    for (let i = 0; i < tasksPerColumn; i++) {
      // Pour chaque ligne, traiter les 3 colonnes
      for (let col = 0; col < 3; col++) {
        const taskIndex = i + (col * tasksPerColumn);
        if (taskIndex < taskIds.length) {
          const taskId = taskIds[taskIndex];
          const done = customTasks[taskId];
          const progress = data.workLog?.tasksPerformed?.tasksProgress?.[taskId] || 0;
          
          const colX = margin + (col * colWidth);
          
          // Nom de la tâche (plus court)
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          
          // Utiliser le nom de la tâche au lieu de l'ID
          const taskName = data.customTasks?.find(task => task.id === taskId)?.name || taskId;
          const shortenedName = taskName.length > 15 ? 
            taskName.substring(0, 15) + "..." : 
            taskName;
            
          pdf.text(sanitizeText(shortenedName), colX, yPos);
          
          // Icône de statut
          if (done) {
            pdf.setTextColor(61, 174, 43);
            pdf.text("✓", colX + colWidth - 15, yPos);
            pdf.setTextColor(60, 60, 60);
          }
          
          // Barre de progression (plus petite)
          const progressWidth = colWidth - 20;
          yPos += 4;
          
          // Fond de la barre de progression
          pdf.setFillColor(220, 220, 220);
          pdf.rect(colX, yPos, progressWidth, 2, 'F');
          
          // Remplissage de la barre de progression
          pdf.setFillColor(61, 174, 43);
          pdf.rect(colX, yPos, progressWidth * progress / 100, 2, 'F');
          
          // Pourcentage
          pdf.setFontSize(7);
          pdf.text(`${progress}%`, colX + progressWidth + 2, yPos + 2);
        }
      }
      
      yPos += 7; // Espacement réduit entre les lignes de tâches
    }
  } else {
    // Pas de tâches personnalisées
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text("Aucune tâche personnalisée définie", margin, yPos);
    yPos += 4;
  }
  
  return yPos + 2; // Réduire l'espace après la section
}
