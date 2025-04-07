
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkLog } from '@/types/models';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useApp } from '@/context/AppContext';
import { 
  getCurrentYear,
  filterWorkLogsByYear,
  getYearsFromWorkLogs,
  extractClientName, 
  extractAddress, 
  extractDescription, 
  extractLinkedProjectId,
  extractHourlyRate,
  extractSignedQuote
} from '@/utils/helpers';
import { toast } from 'sonner';

export function useBlankWorksheetList() {
  const navigate = useNavigate();
  const { workLogs, deleteWorkLog } = useWorkLogs();
  const { getProjectById } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedWorkLog, setSelectedWorkLog] = useState<WorkLog | null>(null);
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
  const [workLogToDelete, setWorkLogToDelete] = useState<string | null>(null);

  // Identify blank worksheets (those with IDs starting with "blank-")
  const blankWorkSheets = workLogs.filter(log => log.projectId.startsWith('blank-'));
  
  // Available years for filtering
  const availableYears = getYearsFromWorkLogs(blankWorkSheets);
  
  // Filter by year
  const yearFilteredSheets = selectedYear 
    ? filterWorkLogsByYear(blankWorkSheets, selectedYear) 
    : blankWorkSheets;

  // Filter by search
  const filteredSheets = yearFilteredSheets.filter(sheet => {
    if (!search.trim()) return true;
    
    const searchLower = search.toLowerCase();
    const clientName = extractClientName(sheet.notes || '');
    const address = extractAddress(sheet.notes || '');
    const notes = sheet.notes || '';
    
    // Check if the worksheet is linked to a project
    const linkedProjectId = extractLinkedProjectId(sheet.notes || '');
    const linkedProject = linkedProjectId ? getProjectById(linkedProjectId) : null;
    const projectName = linkedProject ? linkedProject.name.toLowerCase() : '';
    
    return (
      clientName.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower) ||
      formatDate(sheet.date).includes(searchLower) ||
      notes.toLowerCase().includes(searchLower) ||
      projectName.includes(searchLower) ||
      sheet.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });

  // Sort by date
  const sortedSheets = [...filteredSheets].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleExportPDF = (sheetId: string) => {
    const sheet = workLogs.find(log => log.id === sheetId);
    if (sheet) {
      setSelectedWorkLog(sheet);
      setIsPDFDialogOpen(true);
    } else {
      toast.error("Fiche non trouvée");
    }
  };

  const handlePrint = (sheetId: string) => {
    navigate(`/worklogs/${sheetId}?print=true`);
  };

  const handleEdit = (sheetId: string, onEdit?: (id: string) => void) => {
    if (onEdit) {
      onEdit(sheetId);
    } else {
      navigate(`/worklogs/${sheetId}`);
    }
  };
  
  const handleDeleteConfirm = () => {
    if (workLogToDelete) {
      deleteWorkLog(workLogToDelete);
      setWorkLogToDelete(null);
      toast.success("Fiche supprimée avec succès");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };
  
  const clearFilters = () => {
    setSearch('');
    setSelectedYear(getCurrentYear());
    setSortOrder('newest');
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('fr-FR');
    }
    return date.toLocaleDateString('fr-FR');
  };

  return {
    search,
    setSearch,
    selectedYear,
    setSelectedYear,
    sortOrder,
    availableYears,
    blankWorkSheets,
    sortedSheets,
    filteredSheets,
    isPDFDialogOpen,
    setIsPDFDialogOpen,
    selectedWorkLog,
    workLogToDelete,
    setWorkLogToDelete,
    handleExportPDF,
    handlePrint,
    handleEdit,
    handleDeleteConfirm,
    toggleSortOrder,
    clearFilters,
    getCurrentYear,
    getProjectById,
    extractClientName,
    extractAddress,
    extractDescription,
    extractLinkedProjectId,
    extractHourlyRate,
    extractSignedQuote
  };
}
