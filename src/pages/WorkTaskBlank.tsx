
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/utils/date';

// Déclaration pour TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
  }
}

const WorkTaskBlank = () => {
  const { workTasks } = useApp();

  const generateBlankPDF = () => {
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
      pdf.text(formatDate(new Date()), pageWidth / 2, yPos, { align: 'center' });
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
      pdf.text("_________________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Adresse:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("_________________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Contact client:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("_________________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Client présent:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("□ Oui    □ Non", margin + 35, yPos);
      
      // Personnel présent
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Personnel présent", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      for (let i = 0; i < 5; i++) {
        pdf.setFont('helvetica', 'normal');
        pdf.text(`□ _________________________________`, margin + 5, yPos);
        yPos += 5;
      }
      
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
        departure: "________",
        arrival: "________",
        end: "________",
        breakTime: "________",
        travelHours: "________",
        workHours: "________",
        totalHours: "________",
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
      pdf.text(`___________ €/h`, margin + 30, yPos);
      
      // Tâches personnalisées
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Tâches personnalisées", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      for (let i = 0; i < 5; i++) {
        pdf.setFont('helvetica', 'normal');
        pdf.text(`□ _________________________________ : _______% complété`, margin + 5, yPos);
        yPos += 5;
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
      pdf.text("□ Oui    □ Non", margin + 40, yPos);
      
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Déchets laissés sur place:", margin + 5, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("□ Oui    □ Non", margin + 60, yPos);
      
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Détails:", margin + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.text("_______________________________________________", margin + 5, yPos);
      yPos += 5;
      pdf.text("_______________________________________________", margin + 5, yPos);
      
      // Tableau des fournitures
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Fournitures", margin, yPos);
      
      yPos += 7;
      
      const suppliesColumns = [
        { header: 'Fournisseur', dataKey: 'supplier' },
        { header: 'Matériaux', dataKey: 'material' },
        { header: 'Unité', dataKey: 'unit' },
        { header: 'Quantité', dataKey: 'quantity' },
        { header: 'Prix unitaire (€)', dataKey: 'unitPrice' },
        { header: 'Prix total (€)', dataKey: 'totalPrice' },
      ];
      
      const suppliesData = [
        {
          supplier: "",
          material: "",
          unit: "",
          quantity: "",
          unitPrice: "",
          totalPrice: ""
        },
        {
          supplier: "",
          material: "",
          unit: "",
          quantity: "",
          unitPrice: "",
          totalPrice: ""
        },
        {
          supplier: "",
          material: "",
          unit: "",
          quantity: "",
          unitPrice: "",
          totalPrice: ""
        }
      ];
      
      pdf.autoTable({
        startY: yPos,
        head: [suppliesColumns.map(col => col.header)],
        body: suppliesData.map(row => suppliesColumns.map(col => row[col.dataKey as keyof typeof row])),
        foot: [['', '', '', '', 'Total', '']],
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
      
      // Notes
      yPos += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Notes et observations", margin, yPos);
      
      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      for (let i = 0; i < 5; i++) {
        pdf.text("_______________________________________________", margin + 5, yPos);
        yPos += 5;
      }
      
      // Signatures
      yPos += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Signatures", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      
      // Client signature
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature client:", margin + 5, yPos);
      
      // Team lead signature
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature responsable:", margin + contentWidth/2 + 5, yPos);
      
      // Pied de page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Document généré le ${formatDate(new Date())}`, pageWidth / 2, 285, { align: 'center' });
      
      // Sauvegarde du PDF
      pdf.save(`Fiche_Travaux_Vierge_${formatDate(new Date()).replace(/\//g, '-')}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      return false;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Fiche de travaux vierge</h1>
          <p className="text-muted-foreground">
            Générez une fiche de travaux vierge à imprimer et remplir manuellement.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Générer un PDF vierge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <p>
                Téléchargez un modèle vierge de fiche de travaux que vous pourrez imprimer et remplir à la main sur le terrain.
              </p>
            </div>
            <Button 
              onClick={generateBlankPDF}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Télécharger le modèle</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkTaskBlank;
