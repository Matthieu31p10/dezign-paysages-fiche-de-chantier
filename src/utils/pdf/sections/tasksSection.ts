
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
    
    // Traiter toutes les tâches en colonnes sans limite
    for (let i = 0; i < taskIds.length; i++) {
      const taskId = taskIds[i];
      const done = customTasks[taskId];
      const progress = data.workLog?.tasksPerformed?.tasksProgress?.[taskId] || 0;
      
      // Définir la colonne (0, 1, ou 2)
      const colIndex = i % 3;
      const colX = margin + (colIndex * colWidth);
      
      // Nom de la tâche (plus descriptif)
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      // Utiliser le nom de la tâche au lieu de l'ID
      const taskName = data.customTasks?.find(task => task.id === taskId)?.name || taskId;
      const shortenedName = taskName.length > 20 ? 
        taskName.substring(0, 20) + "..." : 
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
      
      // Passer à la ligne suivante si on a traité 3 tâches ou si c'est la dernière tâche
      if (colIndex === 2 || i === taskIds.length - 1) {
        yPos += 7; // Espacement entre les lignes de tâches
      }
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
