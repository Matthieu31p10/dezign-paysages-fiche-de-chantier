
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
    case 'one_big_bag': return '1 Big-bag';
    case 'two_big_bags': return '2 Big-bags';
    case 'half_dumpster': return '1/2 Benne';
    case 'one_dumpster': return '1 Benne';
    case 'none': 
    default: return 'Aucune collecte';
  }
};

// Fonction utilitaire pour dessiner une boîte d'information
export function drawInfoBox(pdf: any, x: number, y: number, width: number, height: number, title: string, contentDrawer: () => void) {
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
export function drawTimeBox(pdf: any, x: number, y: number, width: number, title: string, time: string) {
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
