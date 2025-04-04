
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
  // Supprime les caractères potentiellement dangereux
  return text.replace(/[^\w\s\.,;:!?()\-–—@€$£¥%&*+=#]/g, '')
    .substring(0, 1000); // Limite la longueur
};

// Fonction pour tronquer le texte si trop long
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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

// Cette fonction gère la génération de PDF pour les fiches de suivi
export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  try {
    // Sécurité: vérification des données avant génération
    if (!data.workLog) {
      throw new Error('Données de fiche de suivi manquantes');
    }
    
    // Initialisation du PDF au format A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Définir les couleurs (vert similaire au template)
    const primaryColor = [141, 198, 63];
    const primaryColorHex = '#8dc63f';
    
    // Définir les marges et positions
    const margin = 15;
    const width = 210 - (margin * 2);
    const pageHeight = 297 - (margin * 2);
    
    // Options par défaut si non fournies
    const options: PDFOptions = data.pdfOptions || {
      includeContactInfo: true,
      includeCompanyInfo: true,
      includePersonnel: true,
      includeTasks: true,
      includeWatering: true,
      includeNotes: true,
      includeTimeTracking: true
    };
    
    // Fonction pour dessiner des bordures autour des tableaux et sections
    const drawRect = (x: number, y: number, w: number, h: number, color?: number[]) => {
      if (color) {
        pdf.setDrawColor(color[0], color[1], color[2]);
      } else {
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      }
      pdf.rect(x, y, w, h, 'S');
    };
    
    // Dessiner la bordure extérieure (rectangle vert)
    drawRect(margin, margin, width, pageHeight);
    
    // Ajouter le logo de l'entreprise si disponible
    let currentY = margin + 10;
    
    if (options.includeCompanyInfo && data.companyLogo) {
      try {
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, currentY, 25, 25);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du logo:', error);
      }
    }
    
    // Ajouter les informations de l'entreprise si disponibles
    if (options.includeCompanyInfo && data.companyInfo) {
      const infoStartX = margin + 35;
      pdf.setFontSize(9);
      
      // En-tête avec titre central
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('FICHE DE SUIVI', 105, currentY + 5, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Informations de l'entreprise
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(sanitizeText(data.companyInfo.name), infoStartX, currentY + 12);
      pdf.text(sanitizeText(data.companyInfo.address), infoStartX, currentY + 17);
      pdf.text(`Tél: ${sanitizeText(data.companyInfo.phone)}`, infoStartX, currentY + 22);
      pdf.text(`Email: ${sanitizeText(data.companyInfo.email)}`, infoStartX, currentY + 27);
    }
    
    currentY = margin + 40;
    
    // Section: Informations du chantier
    if (options.includeContactInfo && data.project && data.workLog) {
      // Encadré vert pour le titre de section
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, currentY, width, 8, 'F');
      
      // Titre de section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMATIONS CHANTIER', margin + 5, currentY + 5);
      pdf.setTextColor(0, 0, 0);
      
      // Table d'information
      currentY += 8;
      
      // Créer un tableau pour les informations du chantier
      const projectInfo = [
        ['Chantier:', sanitizeText(data.project.name), 'Date:', formatDate(data.workLog.date)],
        ['Adresse:', sanitizeText(data.project.address), 'Durée prévue:', `${data.workLog.duration} heures`],
        ['Contact:', sanitizeText(data.project.contact?.name || ''), 'Téléphone:', sanitizeText(data.project.contact?.phone)]
      ];
      
      // @ts-ignore - Le type jspdf-autotable n'est pas reconnu par TypeScript
      pdf.autoTable({
        startY: currentY,
        body: projectInfo,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 30 },
          1: { cellWidth: 80 },
          2: { fontStyle: 'bold', cellWidth: 30 },
          3: { cellWidth: 40 }
        },
        margin: { left: margin, right: margin }
      });
      
      // @ts-ignore - Récupérer la position finale du tableau
      currentY = pdf.lastAutoTable.finalY + 10;
    }
    
    // Section: Suivi de temps
    if (options.includeTimeTracking && data.workLog) {
      // Encadré vert pour le titre de section
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, currentY, width, 8, 'F');
      
      // Titre de section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUIVI DE TEMPS', margin + 5, currentY + 5);
      pdf.setTextColor(0, 0, 0);
      
      currentY += 8;
      
      // Créer un tableau pour le suivi de temps - Optimisé en 2 colonnes
      const timeTracking = [
        ['Départ:', data.workLog.timeTracking.departure, 'Arrivée:', data.workLog.timeTracking.arrival],
        ['Fin:', data.workLog.timeTracking.end || data.endTime || '--:--', 'Pause:', `${data.workLog.timeTracking.breakTime} h`],
        ['Total heures:', `${data.workLog.timeTracking.totalHours.toFixed(2)} h`, '', '']
      ];
      
      // @ts-ignore
      pdf.autoTable({
        startY: currentY,
        body: timeTracking,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { fontStyle: 'bold', cellWidth: 40 },
          3: { cellWidth: 40 }
        },
        margin: { left: margin, right: margin }
      });
      
      // @ts-ignore
      currentY = pdf.lastAutoTable.finalY + 5;
    }
    
    // Section: Personnel
    if (options.includePersonnel && data.workLog) {
      // Encadré vert pour le titre de section
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, currentY, width, 8, 'F');
      
      // Titre de section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PERSONNEL', margin + 5, currentY + 5);
      pdf.setTextColor(0, 0, 0);
      
      currentY += 8;
      
      // Liste du personnel
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Sécurité: valider et sanitiser la liste du personnel
      const personnel = data.workLog.personnel
        .map(p => sanitizeText(p))
        .filter(p => p.length > 0)
        .join(', ');
      
      // @ts-ignore
      pdf.autoTable({
        startY: currentY,
        body: [[personnel]],
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 5,
        },
        margin: { left: margin, right: margin }
      });
      
      // @ts-ignore
      currentY = pdf.lastAutoTable.finalY + 5;
    }
    
    // Section: Tâches personnalisées
    if (options.includeTasks && data.workLog) {
      // Vérifier s'il y a des tâches personnalisées
      const hasCustomTasks = data.workLog.tasksPerformed.customTasks && 
                            Object.entries(data.workLog.tasksPerformed.customTasks).length > 0;
      
      if (hasCustomTasks) {
        // Encadré vert pour le titre de section
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin, currentY, width, 8, 'F');
        
        // Titre de section
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TÂCHES PERSONNALISÉES', margin + 5, currentY + 5);
        pdf.setTextColor(0, 0, 0);
        
        currentY += 8;
        
        // Préparer les tâches personnalisées
        const customTasksArray = Object.entries(data.workLog.tasksPerformed.customTasks)
          .filter(([_, done]) => done) // Ne montrer que les tâches effectuées
          .map(([taskId, _]) => {
            const progress = data.workLog.tasksPerformed.tasksProgress?.[taskId] || 0;
            return [
              sanitizeText(taskId), // ID de la tâche (nom)
              `${progress}%`        // Progression en pourcentage
            ];
          });
        
        if (customTasksArray.length > 0) {
          // @ts-ignore
          pdf.autoTable({
            startY: currentY,
            body: customTasksArray,
            theme: 'plain',
            styles: {
              fontSize: 9,
              cellPadding: 3,
            },
            columnStyles: {
              0: { fontStyle: 'bold', cellWidth: 150 },
              1: { cellWidth: 30, halign: 'center' }
            },
            margin: { left: margin, right: margin }
          });
          
          // @ts-ignore
          currentY = pdf.lastAutoTable.finalY + 5;
        }
      }
    }
    
    // Section: Arrosages et déchets
    if ((options.includeWatering || data.workLog.wasteManagement) && data.workLog) {
      // Encadré vert pour le titre de section
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, currentY, width, 8, 'F');
      
      // Titre de section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ARROSAGE ET COLLECTE DES DÉCHETS', margin + 5, currentY + 5);
      pdf.setTextColor(0, 0, 0);
      
      currentY += 8;
      
      // Statut d'arrosage et gestion des déchets
      const wateringStatus = 
        data.workLog.tasksPerformed.watering === 'none' ? 'Pas d\'arrosage' :
        data.workLog.tasksPerformed.watering === 'on' ? 'Allumé' : 'Coupé';
      
      const wasteManagement = getWasteManagementText(data.workLog.wasteManagement);
      
      const wateringData = [
        ['État arrosage:', wateringStatus, 'Collecte déchets:', wasteManagement],
        ['Consommation eau:', data.workLog.waterConsumption !== undefined ? `${data.workLog.waterConsumption} m³` : 'Non renseigné', '', '']
      ];
      
      // @ts-ignore
      pdf.autoTable({
        startY: currentY,
        body: wateringData,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { fontStyle: 'bold', cellWidth: 40 },
          3: { cellWidth: 40 }
        },
        margin: { left: margin, right: margin }
      });
      
      // @ts-ignore
      currentY = pdf.lastAutoTable.finalY + 5;
    }
    
    // Section: Notes
    if (options.includeNotes && data.workLog && data.workLog.notes) {
      // Encadré vert pour le titre de section
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin, currentY, width, 8, 'F');
      
      // Titre de section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NOTES ET OBSERVATIONS', margin + 5, currentY + 5);
      pdf.setTextColor(0, 0, 0);
      
      currentY += 8;
      
      // Sécurité: nettoyer et limiter les notes
      const cleanNotes = sanitizeText(data.workLog.notes);
      
      // Diviser les notes en lignes pour s'adapter à la largeur disponible
      const textLines = pdf.splitTextToSize(cleanNotes, width - 10);
      
      // @ts-ignore
      pdf.autoTable({
        startY: currentY,
        body: [[textLines.join('\n')]],
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          overflow: 'linebreak',
          minCellHeight: 20
        },
        margin: { left: margin, right: margin }
      });
    }
    
    // Ajouter un pied de page avec la date de génération
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const today = new Date();
    pdf.text(`Document généré le ${formatDate(today)}`, 105, 287, { align: 'center' });
    
    // Ajouter un numéro de page
    pdf.setFontSize(8);
    pdf.text('Page 1/1', 180, 287);
    
    // Générer un nom de fichier sécurisé
    const projectName = data.project?.name ? sanitizeText(data.project.name).replace(/[^a-z0-9]/gi, '_') : 'chantier';
    const dateStr = formatDate(data.workLog.date).replace(/\//g, '-');
    const fileName = `Fiche_Suivi_${projectName}_${dateStr}.pdf`;
    
    // Sauvegarder le PDF
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
