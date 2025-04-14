
import { useState, useMemo } from 'react';
import { WorkLog } from '@/types/models';
import { formatDate, getCurrentYear } from '@/utils/helpers';
import { getYearsFromWorkLogs } from '@/utils/date-helpers';
import { extractClientName, extractAddress, extractLinkedProjectId } from '@/utils/notes-extraction';

// Filter for blank worksheets
const useBlankWorksheetFilter = (workLogs: WorkLog[]) => {
  return useMemo(() => {
    return workLogs.filter(log => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
    );
  }, [workLogs]);
};

// Get available years for the filter dropdown
const useAvailableYears = (worksheets: WorkLog[]) => {
  return useMemo(() => {
    return getYearsFromWorkLogs(worksheets);
  }, [worksheets]);
};

// Apply year filter
const useYearFilter = (worksheets: WorkLog[], selectedYear: number) => {
  return useMemo(() => {
    return selectedYear 
      ? worksheets.filter(log => {
          const date = new Date(log.date);
          return date.getFullYear() === selectedYear;
        })
      : worksheets;
  }, [worksheets, selectedYear]);
};

// Apply invoice filter
const useInvoiceFilter = (worksheets: WorkLog[], invoiceFilter: 'all' | 'invoiced' | 'not-invoiced') => {
  return useMemo(() => {
    if (invoiceFilter === 'all') return worksheets;
    return worksheets.filter(sheet => {
      if (invoiceFilter === 'invoiced') return sheet.invoiced === true;
      return sheet.invoiced !== true;
    });
  }, [worksheets, invoiceFilter]);
};

// Apply search filter
const useSearchFilter = (
  worksheets: WorkLog[], 
  search: string,
  getProjectById: (id: string) => any
) => {
  return useMemo(() => {
    if (!search.trim()) return worksheets;
    
    const searchLower = search.toLowerCase();
    return worksheets.filter(sheet => {
      const clientName = extractClientName(sheet.notes || '');
      const address = extractAddress(sheet.notes || '');
      const notes = sheet.notes || '';
      
      const linkedProjectId = extractLinkedProjectId(sheet.notes || '');
      const linkedProject = linkedProjectId ? getProjectById(linkedProjectId) : null;
      const projectName = linkedProject ? linkedProject.name.toLowerCase() : '';
      
      return (
        clientName.toLowerCase().includes(searchLower) ||
        address.toLowerCase().includes(searchLower) ||
        formatDate(sheet.date).includes(searchLower) ||
        notes.toLowerCase().includes(searchLower) ||
        projectName.includes(searchLower) ||
        (sheet.projectId && sheet.projectId.toLowerCase().includes(searchLower)) ||
        sheet.personnel.some(p => p.toLowerCase().includes(searchLower))
      );
    });
  }, [worksheets, search, getProjectById]);
};

// Apply sort order
const useSortedWorksheets = (worksheets: WorkLog[], sortOrder: 'newest' | 'oldest') => {
  return useMemo(() => {
    return [...worksheets].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [worksheets, sortOrder]);
};

// Main hook that combines all the filtering logic
export const useBlankSheetFilters = (workLogs: WorkLog[], getProjectById: (id: string) => any) => {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'invoiced' | 'not-invoiced'>('all');
  
  // Apply filters in a chain
  const blankWorkSheets = useBlankWorksheetFilter(workLogs);
  const availableYears = useAvailableYears(blankWorkSheets);
  const yearFilteredSheets = useYearFilter(blankWorkSheets, selectedYear);
  const invoiceFilteredSheets = useInvoiceFilter(yearFilteredSheets, invoiceFilter);
  const filteredSheets = useSearchFilter(invoiceFilteredSheets, search, getProjectById);
  const sortedSheets = useSortedWorksheets(filteredSheets, sortOrder);
  
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return search || selectedYear !== getCurrentYear() || sortOrder !== 'newest' || invoiceFilter !== 'all';
  }, [search, selectedYear, sortOrder, invoiceFilter]);
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedYear(getCurrentYear());
    setSortOrder('newest');
    setInvoiceFilter('all');
  };
  
  return {
    blankWorkSheets,
    availableYears,
    search,
    setSearch,
    selectedYear, 
    setSelectedYear,
    sortOrder,
    invoiceFilter,
    setInvoiceFilter,
    filteredSheets,
    sortedSheets,
    hasActiveFilters,
    toggleSortOrder,
    clearFilters
  };
};
