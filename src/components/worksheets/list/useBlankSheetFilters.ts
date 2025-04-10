
import { useState, useMemo } from 'react';
import { WorkLog } from '@/types/models';
import { formatDate, getCurrentYear, filterWorkLogsByYear, getYearsFromWorkLogs } from '@/utils/helpers';
import { extractClientName, extractAddress, extractLinkedProjectId } from '@/utils/helpers';

export const useBlankSheetFilters = (workLogs: WorkLog[], getProjectById: (id: string) => any) => {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'invoiced' | 'not-invoiced'>('all');
  
  // Filter blank worksheets
  const blankWorkSheets = useMemo(() => {
    return workLogs.filter(log => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
    );
  }, [workLogs]);
  
  // Get available years for filtering
  const availableYears = useMemo(() => {
    return getYearsFromWorkLogs(blankWorkSheets);
  }, [blankWorkSheets]);
  
  // Year filtered sheets
  const yearFilteredSheets = useMemo(() => {
    return selectedYear 
      ? filterWorkLogsByYear(blankWorkSheets, selectedYear) 
      : blankWorkSheets;
  }, [blankWorkSheets, selectedYear]);

  // Apply invoice filter
  const invoiceFilteredSheets = useMemo(() => {
    if (invoiceFilter === 'all') return yearFilteredSheets;
    return yearFilteredSheets.filter(sheet => {
      if (invoiceFilter === 'invoiced') return sheet.invoiced === true;
      return sheet.invoiced !== true;
    });
  }, [yearFilteredSheets, invoiceFilter]);
  
  // Apply search filter
  const filteredSheets = useMemo(() => {
    if (!search.trim()) return invoiceFilteredSheets;
    
    const searchLower = search.toLowerCase();
    return invoiceFilteredSheets.filter(sheet => {
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
  }, [invoiceFilteredSheets, search, getProjectById]);
  
  // Sort the filtered sheets
  const sortedSheets = useMemo(() => {
    return [...filteredSheets].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredSheets, sortOrder]);
  
  // Check if any filters are active
  const hasActiveFilters = search || selectedYear !== getCurrentYear() || sortOrder !== 'newest' || invoiceFilter !== 'all';
  
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
