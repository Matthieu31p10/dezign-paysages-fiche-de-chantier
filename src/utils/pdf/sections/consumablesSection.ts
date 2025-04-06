
import { PDFData } from '../types';

export const drawConsumablesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeConsumables || !data.consumables?.length) {
    return yPos;
  }
  
  yPos += 8;
  
  // En-tête de la section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Consommables", margin, yPos);
  
  yPos += 8;
  
  // Création du tableau des consommables
  const consumables = data.consumables;
  
  // Paramètres du tableau
  const tableHeaders = [["Fournisseur", "Produit", "Unité", "Quantité", "Prix unit.", "Total"]];
  
  // Préparation des données
  const tableData = consumables.map(item => [
    item.supplier || "-",
    item.product,
    item.unit,
    item.quantity.toString(),
    `${item.unitPrice.toFixed(2)} €`,
    `${item.totalPrice.toFixed(2)} €`
  ]);
  
  // Dessiner le tableau
  (pdf as any).autoTable({
    head: tableHeaders,
    body: tableData,
    startY: yPos,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  });
  
  // Récupérer la position y finale du tableau
  yPos = (pdf as any).lastAutoTable.finalY + 5;
  
  // Calculer le total des consommables
  const totalConsumables = consumables.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Afficher le total
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total des consommables: ${totalConsumables.toFixed(2)} €`, contentWidth + margin, yPos, { align: 'right' });
  
  return yPos + 10;
};
