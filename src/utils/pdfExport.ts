import { WorkLog } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Import jsPDF dynamically to avoid SSR issues
let jsPDF: any;
let autoTable: any;

const loadPDFLibs = async () => {
  if (!jsPDF) {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.default;
    
    const autoTableModule = await import('jspdf-autotable');
    autoTable = autoTableModule.default;
  }
  return { jsPDF, autoTable };
};

export const exportPassagesToPDF = async (
  passages: WorkLog[],
  getProjectName: (projectId: string) => string,
  filters?: {
    selectedProject?: string;
    selectedTeam?: string;
    searchQuery?: string;
    periodFilter?: string;
  }
) => {
  try {
    await loadPDFLibs();
    
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport des Passages', pageWidth / 2, 30, { align: 'center' });
    
    // Date du rapport
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}`,
      pageWidth / 2,
      40,
      { align: 'center' }
    );
    
    // Filtres appliqués
    let yPosition = 50;
    if (filters) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtres appliqués:', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (filters.selectedProject) {
        doc.text(`• Projet: ${getProjectName(filters.selectedProject)}`, margin + 5, yPosition);
        yPosition += 7;
      }
      
      if (filters.selectedTeam) {
        doc.text(`• Équipe: ${filters.selectedTeam}`, margin + 5, yPosition);
        yPosition += 7;
      }
      
      if (filters.searchQuery) {
        doc.text(`• Recherche: "${filters.searchQuery}"`, margin + 5, yPosition);
        yPosition += 7;
      }
      
      if (filters.periodFilter && filters.periodFilter !== 'all') {
        const periodLabels: Record<string, string> = {
          '7': '7 derniers jours',
          '30': '30 derniers jours',
          '90': '90 derniers jours',
          '180': '6 derniers mois',
          '365': 'Dernière année'
        };
        doc.text(`• Période: ${periodLabels[filters.periodFilter] || filters.periodFilter}`, margin + 5, yPosition);
        yPosition += 7;
      }
      
      yPosition += 10;
    }
    
    // Statistiques de résumé
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Résumé:', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Total des passages: ${passages.length}`, margin + 5, yPosition);
    yPosition += 7;
    
    const totalHours = passages.reduce((sum, p) => sum + (p.timeTracking?.totalHours || p.duration || 0), 0);
    doc.text(`• Heures totales: ${totalHours.toFixed(1)}h`, margin + 5, yPosition);
    yPosition += 7;
    
    const uniqueProjects = new Set(passages.map(p => p.projectId)).size;
    doc.text(`• Projets concernés: ${uniqueProjects}`, margin + 5, yPosition);
    yPosition += 15;
    
    // Tableau des passages
    const tableData = passages.map(passage => {
      const getDaysSincePassage = (date: string) => {
        const passageDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - passageDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };
      
      return [
        format(new Date(passage.date), 'dd/MM/yyyy', { locale: fr }),
        getProjectName(passage.projectId),
        passage.personnel?.[0] || 'N/A',
        `${passage.timeTracking?.totalHours || passage.duration || 0}h`,
        `${getDaysSincePassage(passage.date)}j`,
        passage.notes ? passage.notes.substring(0, 50) + (passage.notes.length > 50 ? '...' : '') : ''
      ];
    });
    
    autoTable(doc, {
      head: [['Date', 'Projet', 'Équipe', 'Durée', 'Écart', 'Remarques']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 45 }
      }
    });
    
    // Pied de page
    const finalY = (doc as any).lastAutoTable.finalY || yPosition + 100;
    if (finalY < pageHeight - 40) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Ce rapport a été généré automatiquement par l\'application Dezign Paysages.',
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    }
    
    // Sauvegarde
    const fileName = `passages_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    return { success: false, error: 'Erreur lors de la génération du PDF' };
  }
};