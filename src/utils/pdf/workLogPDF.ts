
import { ProjectInfo, WorkLog, CompanyInfo } from '@/types/models';
import { formatDate } from '../date';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

// Fonction sécurisée pour nettoyer les textes avant insertion dans le PDF
const sanitizeText = (text?: string): string => {
  if (!text) return '';
  return text.replace(/[^\w\s\.,;:!?()\-–—@€$£¥%&*+=#]/g, '')
    .substring(0, 1000);
};

// Fonction pour obtenir le texte pour la gestion des déchets
const getWasteManagementText = (wasteCode?: string): string => {
  switch (wasteCode) {
    case 'one_big_bag': return '1 Big-bag';
    case 'two_big_bags': return '2 Big-bags';
    case 'half_dumpster': return '1/2 Benne';
    case 'one_dumpster': return '1 Benne';
    case 'none': 
    default: return 'Aucune collecte';
  }
};

// Cette fonction gère la génération de PDF pour les fiches de suivi avec le nouveau design
export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  try {
    // Vérification des données
    if (!data.workLog) {
      throw new Error('Données de fiche de suivi manquantes');
    }
    
    // Initialisation du PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Couleurs
    const primaryColor = [61, 174, 43]; // Vert plus vif
    const textColor = [60, 60, 60]; // Texte gris foncé
    const lightBgColor = [245, 245, 245]; // Fond gris clair
    
    // Marge et dimensions
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    
    // Réglage des couleurs de texte
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // En-tête du document
    let yPos = margin;
    
    // Logo de l'entreprise et informations
    if (data.pdfOptions?.includeCompanyInfo && data.companyInfo) {
      if (data.companyLogo) {
        try {
          pdf.addImage(data.companyLogo, 'PNG', margin, yPos, 25, 25);
          
          // Informations entreprise sur la droite du logo
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(sanitizeText(data.companyInfo.name), margin + 30, yPos + 5);
          pdf.text(sanitizeText(data.companyInfo.address || ''), margin + 30, yPos + 10);
          pdf.text(`Tél: ${sanitizeText(data.companyInfo.phone || '')}`, margin + 30, yPos + 15);
          pdf.text(`Email: ${sanitizeText(data.companyInfo.email || '')}`, margin + 30, yPos + 20);
        } catch (error) {
          console.error('Erreur lors de l\'ajout du logo:', error);
        }
      } else {
        // Sans logo, afficher les informations de l'entreprise en haut
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(sanitizeText(data.companyInfo.name), margin, yPos + 8);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(sanitizeText(data.companyInfo.address || ''), margin, yPos + 14);
        pdf.text(`Tél: ${sanitizeText(data.companyInfo.phone || '')}`, margin, yPos + 20);
        pdf.text(`Email: ${sanitizeText(data.companyInfo.email || '')}`, margin, yPos + 26);
      }
    }
    
    // Titre du document et date
    yPos += 30;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    
    // Si on a les informations du projet, on affiche le nom
    if (data.pdfOptions?.includeContactInfo && data.project) {
      pdf.text(sanitizeText(data.project.name), margin, yPos);
    } else {
      pdf.text("Fiche de suivi", margin, yPos);
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fiche de suivi du ${formatDate(data.workLog.date)}`, margin, yPos + 7);
    
    // Ligne de séparation
    yPos += 12;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section détails du passage
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Détails du passage", pageWidth / 2, yPos, { align: 'center' });
    
    // Zones pour les détails principaux
    yPos += 10;
    
    // Première ligne: Date, Durée prévue, Temps total
    const firstRowY = yPos;
    
    // Colonne 1: Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Date", margin, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(formatDate(data.workLog.date), margin, yPos + 8);
    
    // Colonne 2: Durée prévue
    const col2X = margin + contentWidth / 3;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Durée prévue", col2X, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`${data.workLog.duration} heures`, col2X, yPos + 8);
    
    // Colonne 3: Temps total (équipe)
    const col3X = margin + (contentWidth * 2/3);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Temps total (équipe)", col3X, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const totalTime = data.workLog.timeTracking?.totalHours || 0;
    pdf.text(`${totalTime.toFixed(2)} heures`, col3X, yPos + 8);
    
    // Boîtes d'information
    yPos += 20;
    
    // Écart du temps
    drawInfoBox(pdf, margin, yPos, contentWidth/2 - 5, 25, "Écart du temps de passage", () => {
      if (data.workLog && data.workLog.duration) {
        const hourDiff = totalTime - data.workLog.duration;
        const sign = hourDiff >= 0 ? '+' : '';
        pdf.setTextColor(hourDiff < 0 ? 0 : 76, hourDiff < 0 ? 150 : 175, hourDiff < 0 ? 71 : 80);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${sign}${hourDiff.toFixed(2)} h`, margin + 5, yPos + 12);
        
        // Reset text color
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Durée prévue - (heures effectuées / nombre de passages)`, margin + 5, yPos + 20);
      }
    });
    
    // Gestion des déchets
    const wasteBoxX = margin + contentWidth/2 + 5;
    drawInfoBox(pdf, wasteBoxX, yPos, contentWidth/2 - 5, 25, "Gestion des déchets", () => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(getWasteManagementText(data.workLog?.wasteManagement), wasteBoxX + 5, yPos + 15);
    });
    
    // Consommation d'eau
    yPos += 35;
    drawInfoBox(pdf, margin, yPos, contentWidth, 20, "Consommation d'eau", () => {
      if (data.workLog?.waterConsumption) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${data.workLog.waterConsumption} m³`, margin + 5, yPos + 14);
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text("Non renseigné", margin + 5, yPos + 14);
      }
    });
    
    // Ligne de séparation
    yPos += 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section personnel présent
    if (data.pdfOptions?.includePersonnel && data.workLog.personnel && data.workLog.personnel.length > 0) {
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Personnel présent", margin, yPos);
      
      // Liste du personnel
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      data.workLog.personnel.forEach((person, index) => {
        // Draw a small icon for each person
        pdf.setDrawColor(150, 150, 150);
        pdf.circle(margin + 3, yPos + 2, 1.5, 'S');
        
        pdf.text(sanitizeText(person), margin + 8, yPos + 3);
        yPos += 6;
      });
    }
    
    // Ligne de séparation
    yPos += 6;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section suivi du temps
    if (data.pdfOptions?.includeTimeTracking) {
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Suivi du temps", margin, yPos);
      
      yPos += 10;
      const timeBoxWidth = contentWidth / 3;
      
      // Départ
      drawTimeBox(pdf, margin, yPos, timeBoxWidth - 3, "Départ", data.workLog.timeTracking?.departure || "--:--");
      
      // Arrivée
      drawTimeBox(pdf, margin + timeBoxWidth, yPos, timeBoxWidth - 3, "Arrivée", data.workLog.timeTracking?.arrival || "--:--");
      
      // Heure de fin
      drawTimeBox(pdf, margin + timeBoxWidth * 2, yPos, timeBoxWidth - 3, "Heure de fin", data.workLog.timeTracking?.end || data.endTime || "--:--");
      
      // Pause
      yPos += 25;
      drawTimeBox(pdf, margin, yPos, timeBoxWidth - 3, "Pause", data.workLog.timeTracking?.breakTime || "00:00");
    }
    
    // Ligne de séparation
    yPos += 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section tâches personnalisées
    if (data.pdfOptions?.includeTasks && data.workLog.tasksPerformed?.customTasks) {
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
          const progress = data.workLog.tasksPerformed.tasksProgress?.[taskId] || 0;
          
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
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          
          // Progress bar
          currentY += 4;
          
          // Progress bar background
          pdf.setFillColor(220, 220, 220);
          pdf.rect(colX, currentY, contentWidth/2 - 15, 3, 'F');
          
          // Progress bar fill
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
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
    }
    
    // Ligne de séparation
    yPos += 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section arrosage
    if (data.pdfOptions?.includeWatering) {
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Arrosage", margin, yPos);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const wateringStatus = 
        data.workLog.tasksPerformed.watering === 'on' ? "Allumé" : 
        data.workLog.tasksPerformed.watering === 'off' ? "Coupé" : 
        "Pas d'arrosage";
      
      pdf.text(wateringStatus, margin, yPos + 8);
      
      // Badge pour statut d'arrosage
      if (data.workLog.tasksPerformed.watering !== 'none') {
        const textWidth = pdf.getTextWidth(wateringStatus);
        const badgeX = margin + textWidth + 5;
        const isOn = data.workLog.tasksPerformed.watering === 'on';
        
        pdf.setFillColor(isOn ? 220 : 245, isOn ? 242 : 220, isOn ? 220 : 220);
        pdf.roundedRect(badgeX, yPos + 3, 30, 8, 2, 2, 'F');
        
        pdf.setFontSize(8);
        pdf.setTextColor(isOn ? 200 : 100, isOn ? 0 : 150, isOn ? 0 : 70);
        pdf.text(isOn ? "ACTIF" : "INACTIF", badgeX + 15, yPos + 8, { align: 'center' });
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      }
      
      yPos += 15;
    }
    
    // Section notes et observations
    if (data.pdfOptions?.includeNotes && data.workLog.notes) {
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Notes et observations", margin, yPos);
      
      yPos += 8;
      
      // Encadré pour les notes
      pdf.setDrawColor(200, 200, 200);
      pdf.roundedRect(margin, yPos, contentWidth, 40, 2, 2, 'S');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const sanitizedNotes = sanitizeText(data.workLog.notes);
      const splitNotes = pdf.splitTextToSize(sanitizedNotes, contentWidth - 10);
      
      // Limiter le nombre de lignes affichées
      const maxLines = 10;
      const truncatedNotes = splitNotes.slice(0, maxLines);
      
      pdf.text(truncatedNotes, margin + 5, yPos + 6);
      
      // Si le texte est tronqué, indiquer qu'il y a plus
      if (splitNotes.length > maxLines) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.text("(...)", margin + 5, yPos + 38);
      }
    }
    
    // Pied de page
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Document généré le ${formatDate(new Date())}`, pageWidth / 2, 285, { align: 'center' });
    
    // Génération du nom de fichier
    const projectName = data.project?.name 
      ? sanitizeText(data.project.name).replace(/[^a-z0-9]/gi, '_')
      : 'chantier';
    const dateStr = formatDate(data.workLog.date).replace(/\//g, '-');
    const fileName = `Fiche_Suivi_${projectName}_${dateStr}.pdf`;
    
    pdf.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

// Fonction utilitaire pour dessiner une boîte d'information
function drawInfoBox(pdf: any, x: number, y: number, width: number, height: number, title: string, contentDrawer: () => void) {
  // Rectangle de fond
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(220, 220, 220);
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');
  
  // Titre
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text(title, x + 5, y + 6);
  
  // Reset text color
  pdf.setTextColor(60, 60, 60);
  
  // Contenu
  contentDrawer();
}

// Fonction utilitaire pour dessiner une boîte de temps
function drawTimeBox(pdf: any, x: number, y: number, width: number, title: string, time: string) {
  // Rectangle de fond
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(220, 220, 220);
  pdf.roundedRect(x, y, width, 20, 2, 2, 'FD');
  
  // Titre
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text(title, x + 5, y + 6);
  
  // Heure
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(time, x + 5, y + 16);
}
