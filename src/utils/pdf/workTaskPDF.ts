
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { WorkTask } from '@/types/workTask';
import { formatDate } from '../helpers';

interface WorkTaskPDFOptions {
  workTask: WorkTask;
  fileName?: string;
}

export const generateWorkTaskPDF = async (options: WorkTaskPDFOptions): Promise<string> => {
  const { workTask, fileName } = options;
  
  try {
    // Initialisation du PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Couleurs
    const primaryColor = [61, 174, 43]; // Vert
    const textColor = [60, 60, 60]; // Texte gris foncé
    
    // Marge et dimensions
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    
    // Réglage des couleurs de texte
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // En-tête du document
    let yPos = margin;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text("FICHE DE TRAVAUX", pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text(formatDate(workTask.date), pageWidth / 2, yPos, { align: 'center' });
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // Informations du chantier
    yPos += 15;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Informations du chantier", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Nom du chantier:", margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.projectName, margin + 35, yPos);
    
    yPos += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Adresse:", margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.address, margin + 35, yPos);
    
    yPos += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Contact client:", margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.contactName, margin + 35, yPos);
    
    yPos += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Client présent:", margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.clientPresent ? "Oui" : "Non", margin + 35, yPos);
    
    // Personnel présent
    yPos += 12;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Personnel présent", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    workTask.personnel.forEach((person, index) => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`• ${person}`, margin + 5, yPos);
      yPos += 5;
    });
    
    // Suivi du temps
    yPos += 7;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Suivi du temps", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    
    // Tableau pour les heures
    const timeColumns = [
      { header: 'Départ', dataKey: 'departure' },
      { header: 'Arrivée', dataKey: 'arrival' },
      { header: 'Fin', dataKey: 'end' },
      { header: 'Pause', dataKey: 'breakTime' },
      { header: 'Temps de trajet', dataKey: 'travelHours' },
      { header: 'Temps de travail', dataKey: 'workHours' },
      { header: 'Temps total', dataKey: 'totalHours' },
    ];
    
    const timeData = [{
      departure: workTask.timeTracking.departure,
      arrival: workTask.timeTracking.arrival,
      end: workTask.timeTracking.end,
      breakTime: workTask.timeTracking.breakTime,
      travelHours: `${workTask.timeTracking.travelHours.toFixed(2)}h`,
      workHours: `${workTask.timeTracking.workHours.toFixed(2)}h`,
      totalHours: `${workTask.timeTracking.totalHours.toFixed(2)}h`,
    }];
    
    pdf.autoTable({
      startY: yPos,
      head: [timeColumns.map(col => col.header)],
      body: timeData.map(row => timeColumns.map(col => row[col.dataKey as keyof typeof row])),
      theme: 'striped',
      headStyles: { 
        fillColor: [61, 174, 43], 
        textColor: [255, 255, 255] 
      },
      margin: { left: margin, right: margin },
    });
    
    yPos = (pdf as any).lastAutoTable.finalY + 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Taux horaire:", margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${workTask.hourlyRate.toFixed(2)} €/h`, margin + 30, yPos);
    
    // Tâches personnalisées
    yPos += 12;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Tâches personnalisées", margin, yPos);
    
    const customTasks = Object.entries(workTask.tasksPerformed.customTasks)
      .filter(([_, done]) => done);
    
    if (customTasks.length === 0) {
      yPos += 7;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("Aucune tâche personnalisée effectuée.", margin + 5, yPos);
    } else {
      yPos += 7;
      pdf.setFontSize(10);
      customTasks.forEach(([taskId, _], index) => {
        const progress = workTask.tasksPerformed.tasksProgress?.[taskId] || 0;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`• ${taskId}:`, margin + 5, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${progress}% complété`, margin + 40, yPos);
        yPos += 5;
      });
    }
    
    // Gestion des déchets
    yPos += 7;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Gestion des déchets", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Déchets emportés:", margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.wasteManagement.wasteTaken ? "Oui" : "Non", margin + 40, yPos);
    
    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text("Déchets laissés sur place:", margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(workTask.wasteManagement.wasteLeft ? "Oui" : "Non", margin + 60, yPos);
    
    if (workTask.wasteManagement.wasteDetails) {
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Détails:", margin + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      
      // Wrap text
      const splitText = pdf.splitTextToSize(workTask.wasteManagement.wasteDetails, contentWidth - 10);
      pdf.text(splitText, margin + 5, yPos);
      yPos += splitText.length * 5;
    }
    
    // Tableau des fournitures
    yPos += 12;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Fournitures", margin, yPos);
    
    if (workTask.supplies.length === 0) {
      yPos += 7;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("Aucune fourniture enregistrée.", margin + 5, yPos);
    } else {
      yPos += 7;
      
      const suppliesColumns = [
        { header: 'Fournisseur', dataKey: 'supplier' },
        { header: 'Matériaux', dataKey: 'material' },
        { header: 'Unité', dataKey: 'unit' },
        { header: 'Quantité', dataKey: 'quantity' },
        { header: 'Prix unitaire (€)', dataKey: 'unitPrice' },
        { header: 'Prix total (€)', dataKey: 'totalPrice' },
      ];
      
      const suppliesData = workTask.supplies.map(supply => ({
        supplier: supply.supplier,
        material: supply.material,
        unit: supply.unit,
        quantity: supply.quantity.toString(),
        unitPrice: supply.unitPrice.toFixed(2),
        totalPrice: (supply.quantity * supply.unitPrice).toFixed(2),
      }));
      
      // Ajouter ligne total
      const totalSuppliesPrice = workTask.supplies.reduce(
        (total, supply) => total + (supply.quantity * supply.unitPrice), 
        0
      );
      
      pdf.autoTable({
        startY: yPos,
        head: [suppliesColumns.map(col => col.header)],
        body: suppliesData.map(row => suppliesColumns.map(col => row[col.dataKey as keyof typeof row])),
        foot: [['', '', '', '', 'Total', totalSuppliesPrice.toFixed(2) + ' €']],
        theme: 'striped',
        headStyles: { 
          fillColor: [61, 174, 43], 
          textColor: [255, 255, 255] 
        },
        footStyles: {
          fillColor: [240, 240, 240],
          fontStyle: 'bold'
        },
        margin: { left: margin, right: margin },
      });
      
      yPos = (pdf as any).lastAutoTable.finalY + 5;
    }
    
    // Récapitulatif des coûts
    yPos += 7;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Récapitulatif des coûts", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    
    const laborCost = workTask.timeTracking.workHours * workTask.hourlyRate;
    const totalSuppliesPrice = workTask.supplies.reduce(
      (total, supply) => total + (supply.quantity * supply.unitPrice), 
      0
    );
    const totalPrice = laborCost + totalSuppliesPrice;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Main d'œuvre (${workTask.timeTracking.workHours.toFixed(2)}h à ${workTask.hourlyRate.toFixed(2)}€/h):`, margin + 5, yPos);
    pdf.text(`${laborCost.toFixed(2)} €`, contentWidth, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.text("Fournitures:", margin + 5, yPos);
    pdf.text(`${totalSuppliesPrice.toFixed(2)} €`, contentWidth, yPos, { align: 'right' });
    
    yPos += 2;
    pdf.setDrawColor(150, 150, 150);
    pdf.line(margin + 5, yPos + 2, pageWidth - margin, yPos + 2);
    
    yPos += 7;
    pdf.setFont('helvetica', 'bold');
    pdf.text("TOTAL:", margin + 5, yPos);
    pdf.text(`${totalPrice.toFixed(2)} €`, contentWidth, yPos, { align: 'right' });
    
    // Notes
    if (workTask.notes) {
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Notes et observations", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Wrap text
      const splitText = pdf.splitTextToSize(workTask.notes, contentWidth - 10);
      pdf.text(splitText, margin + 5, yPos);
    }
    
    // Signatures
    if (pdf.getNumberOfPages() > 1) {
      pdf.setPage(pdf.getNumberOfPages());
      yPos = pdf.internal.pageSize.height - 70;
    } else {
      yPos = Math.min(yPos + 20, pdf.internal.pageSize.height - 70);
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Signatures", margin, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    
    const signWidth = (contentWidth - 10) / 2;
    
    // Client signature
    if (workTask.signatures.client) {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature client:", margin + 5, yPos);
      yPos += 5;
      
      try {
        pdf.addImage(
          workTask.signatures.client,
          'PNG',
          margin + 5,
          yPos,
          signWidth,
          30
        );
      } catch (error) {
        console.error("Erreur lors de l'ajout de la signature client:", error);
      }
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature client: Non disponible", margin + 5, yPos + 15);
    }
    
    // Team lead signature
    if (workTask.signatures.teamLead) {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature responsable:", margin + signWidth + 15, yPos);
      yPos += 5;
      
      try {
        pdf.addImage(
          workTask.signatures.teamLead,
          'PNG',
          margin + signWidth + 15,
          yPos,
          signWidth,
          30
        );
      } catch (error) {
        console.error("Erreur lors de l'ajout de la signature responsable:", error);
      }
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature responsable: Non disponible", margin + signWidth + 15, yPos + 15);
    }
    
    // Pied de page
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Document généré le ${formatDate(new Date())}`, pageWidth / 2, 285, { align: 'center' });
    
    // Génération du nom de fichier
    const defaultFileName = `Fiche_Travaux_${workTask.projectName.replace(/[^a-z0-9]/gi, '_')}_${formatDate(workTask.date).replace(/\//g, '-')}.pdf`;
    const outputFileName = fileName || defaultFileName;
    
    pdf.save(outputFileName);
    return outputFileName;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
