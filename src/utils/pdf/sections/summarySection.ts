
import { jsPDF } from "jspdf";
import { WorkLog } from "@/types/models";
import { formatNumber } from "@/utils/format-utils";

// Function to add summary section to PDF
export const addSummarySection = (
  doc: jsPDF,
  workLog: WorkLog,
  startY: number,
  fontSizes: { normal: number; title: number; subtitle: number }
): number => {
  const leftMargin = 14;
  const rightMargin = doc.internal.pageSize.width - 14;
  const columnWidth = 90;
  const lineHeight = 7;

  let currentY = startY;

  // Title
  doc.setFontSize(fontSizes.subtitle);
  doc.setFont('helvetica', 'bold');
  doc.text("Récapitulatif", leftMargin, currentY);
  currentY += lineHeight;

  doc.setFontSize(fontSizes.normal);
  doc.setFont('helvetica', 'normal');

  // Calculate total hours and personnel
  const totalHours = workLog.timeTracking?.totalHours || 0;
  const personnelCount = workLog.personnel?.length || 0;
  const totalPersonnelHours = totalHours * personnelCount;

  // Add hourly rate and total amount if available
  const hourlyRate = workLog.hourlyRate || 0;
  let totalAmount = 0;
  
  // Convert to number for calculation
  const numHourlyRate = typeof hourlyRate === 'string' ? parseFloat(hourlyRate) : hourlyRate;
  
  if (numHourlyRate > 0) {
    totalAmount = totalPersonnelHours * numHourlyRate;
  }

  // Hours summary
  const summaryItems = [
    { label: "Total heures:", value: `${totalHours.toFixed(2)} h` },
    { label: "Nombre de personnes:", value: personnelCount.toString() },
    { label: "Heures x personnes:", value: `${totalPersonnelHours.toFixed(2)} h` },
  ];

  if (numHourlyRate > 0) {
    summaryItems.push(
      { label: "Taux horaire:", value: `${formatNumber(numHourlyRate)} €/h` },
      { label: "Montant total HT:", value: `${formatNumber(totalAmount)} €` }
    );
  }

  // Print all summary items
  summaryItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, leftMargin, currentY);
    
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, leftMargin + columnWidth, currentY);
    
    currentY += lineHeight;
  });

  return currentY + lineHeight / 2;
};
