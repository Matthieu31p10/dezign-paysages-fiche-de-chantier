
import jsPDF from 'jspdf';

// Fonction sécurisée pour nettoyer les textes avant insertion dans le PDF
export const sanitizeText = (text?: string): string => {
  if (!text) return '';
  return text.replace(/[^\w\s\.,;:!?()\-–—@€$£¥%&*+=#]/g, '')
    .substring(0, 1000);
};

// Fonction pour obtenir le texte pour la gestion des déchets
export const getWasteManagementText = (wasteCode?: string): string => {
  switch (wasteCode) {
    // Big bags
    case 'big_bag_1': return '1 Big-bag';
    case 'big_bag_2': return '2 Big-bags';
    case 'big_bag_3': return '3 Big-bags';
    case 'big_bag_4': return '4 Big-bags';
    case 'big_bag_5': return '5 Big-bags';
    
    // Half dumpsters
    case 'half_dumpster_1': return '1 × ½ Benne';
    case 'half_dumpster_2': return '2 × ½ Bennes';
    case 'half_dumpster_3': return '3 × ½ Bennes';
    
    // Full dumpsters
    case 'dumpster_1': return '1 Benne';
    case 'dumpster_2': return '2 Bennes';
    case 'dumpster_3': return '3 Bennes';
    
    case 'none': 
    default: return 'Aucune collecte';
  }
};

// Définition des couleurs pour tout le PDF
export const pdfColors = {
  primary: [61, 174, 43], // Vert du logo
  text: [60, 60, 60],
  lightGrey: [245, 245, 245],
  border: [220, 220, 220],
  heading: [100, 100, 100]
};

// Fonction utilitaire pour dessiner une boîte d'information
export function drawInfoBox(pdf: any, x: number, y: number, width: number, height: number, title: string, contentDrawer: () => void) {
  // Rectangle de fond
  pdf.setFillColor(pdfColors.lightGrey[0], pdfColors.lightGrey[1], pdfColors.lightGrey[2]);
  pdf.setDrawColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]); // Utiliser la couleur verte pour la bordure
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');
  
  // Titre
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]); // Titre en vert
  pdf.text(title, x + 5, y + 6);
  
  // Reset text color
  pdf.setTextColor(pdfColors.text[0], pdfColors.text[1], pdfColors.text[2]);
  
  // Contenu
  contentDrawer();
}

// Fonction utilitaire pour dessiner une boîte de temps
export function drawTimeBox(pdf: any, x: number, y: number, width: number, title: string, time: string) {
  // Rectangle de fond
  pdf.setFillColor(pdfColors.lightGrey[0], pdfColors.lightGrey[1], pdfColors.lightGrey[2]);
  pdf.setDrawColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]); // Bordure verte
  pdf.roundedRect(x, y, width, 20, 2, 2, 'FD');
  
  // Titre
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]); // Titre en vert
  pdf.text(title, x + 5, y + 6);
  
  // Heure
  pdf.setTextColor(pdfColors.text[0], pdfColors.text[1], pdfColors.text[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(time, x + 5, y + 16);
}
