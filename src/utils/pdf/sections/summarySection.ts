
import { PDFData } from '../types';

export const drawSummarySection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeSummary) {
    return yPos;
  }
  
  yPos += 10;
  
  // En-tête de la section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Bilan de l'intervention", margin, yPos);
  
  yPos += 10;
  
  // Récupérer les données
  const totalHours = data.workLog?.timeTracking?.totalHours || 0;
  const hourlyRate = data.hourlyRate || 0;
  const laborCost = totalHours * hourlyRate;
  
  const consumables = data.consumables || [];
  const consumablesCost = consumables.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const totalHT = laborCost + consumablesCost;
  
  // Utiliser le taux de TVA fourni ou par défaut 20%
  const vatRate = data.vatRate || 20;
  const vatAmount = totalHT * (vatRate / 100);
  const totalTTC = totalHT + vatAmount;
  
  // Information sur devis signé
  const signedQuote = data.signedQuote ? "Oui" : "Non";
  
  // Créer un tableau pour le bilan
  const tableData = [
    ["Main d'œuvre", `${totalHours.toFixed(2)} h x ${hourlyRate.toFixed(2)} € = ${laborCost.toFixed(2)} €`],
    ["Consommables", `${consumablesCost.toFixed(2)} €`],
    ["Total HT", `${totalHT.toFixed(2)} €`],
    [`TVA (${vatRate}%)`, `${vatAmount.toFixed(2)} €`],
    ["TOTAL TTC", `${totalTTC.toFixed(2)} €`],
    ["Devis signé", signedQuote]
  ];
  
  // Dessiner le tableau
  (pdf as any).autoTable({
    body: tableData,
    startY: yPos,
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' }
    },
    rowStyles: {
      2: { fontStyle: 'bold' },
      4: { fontStyle: 'bold' }
    },
    theme: 'plain',
  });
  
  // Récupérer la position y finale du tableau
  yPos = (pdf as any).lastAutoTable.finalY + 10;
  
  return yPos;
};
