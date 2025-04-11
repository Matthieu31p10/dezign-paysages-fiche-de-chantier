
import { PDFData } from '../types';
import { drawInfoBox, pdfColors } from '../pdfHelpers';

// Fonction pour convertir le code de gestion des déchets en texte lisible
const getWasteManagementText = (wasteCode?: string) => {
  if (!wasteCode || wasteCode === 'none') return 'Aucun';
  
  const parts = wasteCode.split('_');
  const type = parts[0];
  const quantity = parts.length > 1 ? parts[1] : '1';
  
  switch (type) {
    case 'big_bag': return `${quantity} Big-bag${quantity !== '1' ? 's' : ''}`;
    case 'half_dumpster': return `${quantity} × ½ Benne${quantity !== '1' ? 's' : ''}`;
    case 'dumpster': return `${quantity} Benne${quantity !== '1' ? 's' : ''}`;
    // Support pour les anciens formats
    case 'big_bag_1': return '1 Big-bag';
    case 'big_bag_2': return '2 Big-bags';
    case 'big_bag_3': return '3 Big-bags';
    case 'big_bag_4': return '4 Big-bags';
    case 'big_bag_5': return '5 Big-bags';
    case 'half_dumpster_1': return '1 × ½ Benne';
    case 'half_dumpster_2': return '2 × ½ Bennes';
    case 'half_dumpster_3': return '3 × ½ Bennes';
    case 'dumpster_1': return '1 Benne';
    case 'dumpster_2': return '2 Bennes';
    case 'dumpster_3': return '3 Bennes';
    default: return 'Aucun';
  }
};

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Gestion des déchets - centré
  drawInfoBox(pdf, margin, yPos, contentWidth, 20, "Gestion des déchets", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(getWasteManagementText(data.workLog?.wasteManagement), margin + 5, yPos + 12);
  });
  
  return yPos + 25; // Réduire l'espace après cette section
};
