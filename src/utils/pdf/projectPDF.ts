
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProjectInfo, WorkLog } from '@/types/models';
import { formatDate } from '@/utils/date';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

export const generateProjectPDF = (project: ProjectInfo, workLogs: WorkLog[]): jsPDF => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // PDF metadata
  doc.setProperties({
    title: `Fiche de projet - ${project.name}`,
    subject: 'Fiche de projet générée par l\'application',
    author: 'Your App Name',
    keywords: 'projet, fiche de suivi, PDF'
  });

  // Add header
  doc.setFontSize(22);
  doc.text(`Fiche de projet - ${project.name}`, 14, 20);

  // Add project details
  doc.setFontSize(12);
  doc.text(`Client: ${project.clientName || 'N/A'}`, 14, 30);
  doc.text(`Adresse: ${project.address}`, 14, 36);
  doc.text(`Contact: ${project.contact?.name || 'N/A'} - ${project.contact?.phone || 'N/A'}`, 14, 42);
  doc.text(`Type de projet: ${project.projectType || 'N/A'}`, 14, 48);
  doc.text(`Informations supplémentaires: ${project.additionalInfo || 'N/A'}`, 14, 54);
  
  // Prepare work logs data
  const workLogData = workLogs.map((log, index) => {
    const tasks = [];
    
    // Check watering status
    if (log.tasksPerformed?.watering && log.tasksPerformed.watering !== 'none') {
      tasks.push(`Arrosage: ${log.tasksPerformed.watering === 'on' ? 'Activé' : 'Désactivé'}`);
    }
    
    // Check custom tasks
    if (log.tasksPerformed?.customTasks) {
      Object.entries(log.tasksPerformed.customTasks).forEach(([task, completed]) => {
        if (completed) {
          tasks.push(task);
        }
      });
    }
    
    return [
      index + 1,
      formatDate(log.date),
      log.personnel.join(', '),
      log.timeTracking?.totalHours?.toFixed(1) || '0',
      tasks.join(', ') || 'Aucune',
      log.notes || '',
    ];
  });

  // Define table headers
  const headers = [
    '#',
    'Date',
    'Personnel',
    'Heures',
    'Tâches',
    'Notes'
  ];

  // Add table to the document
  doc.autoTable({
    head: [headers],
    body: workLogData,
    startY: 70,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: '#22c55e',
      textColor: '#fff',
      lineWidth: 0.5,
      lineColor: '#fff',
      halign: 'center',
    },
    bodyStyles: {
      lineWidth: 0.5,
      lineColor: '#ddd',
    },
    alternateRowStyles: {
      fillColor: '#f2f2f2',
    },
  });

  // Add creation date
  const creationDate = formatDate(new Date());
  doc.setFontSize(10);
  doc.text(`Généré le: ${creationDate}`, 14, doc.internal.pageSize.height - 10);
  
  return doc;
};
