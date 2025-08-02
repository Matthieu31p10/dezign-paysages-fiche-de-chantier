import { useState, useEffect, useMemo } from 'react';
import { WorkLog } from '@/types/models';
import { getCurrentYear } from '@/utils/date-helpers';
import { AdvancedFilters } from '../filters/WorkLogAdvancedFilters';
import { isWithinInterval, parseISO } from 'date-fns';

export const useAdvancedWorkLogsFiltering = (workLogs: WorkLog[]) => {
  // État des filtres basiques (existants)
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // État des filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    searchQuery: '',
    dateRange: undefined,
    invoiceStatus: 'all',
    quoteStatus: 'all',
    minHours: null,
    maxHours: null,
    minAmount: null,
    maxAmount: null,
    hasNotes: 'all',
    selectedTeams: [],
    selectedProjects: []
  });

  // Gestion des filtres sauvegardés
  const [savedFilters, setSavedFilters] = useState<Array<{ id: string; name: string; filters: AdvancedFilters }>>(() => {
    const saved = localStorage.getItem('worklog-saved-filters');
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde des filtres favoris
  useEffect(() => {
    localStorage.setItem('worklog-saved-filters', JSON.stringify(savedFilters));
  }, [savedFilters]);

  // Fonction pour sauvegarder un filtre
  const saveFilter = (name: string, filters: AdvancedFilters) => {
    const newFilter = {
      id: Date.now().toString(),
      name,
      filters
    };
    setSavedFilters(prev => [...prev, newFilter]);
  };

  // Fonction pour charger un filtre
  const loadFilter = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
  };

  // Fonction pour supprimer un filtre
  const deleteFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  };

  // Get current week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  };

  // Filter logs based on all criteria
  const filteredLogs = useMemo(() => {
    return workLogs.filter(log => {
      const logDate = new Date(log.date);
      const logYear = logDate.getFullYear();
      const logMonth = logDate.getMonth() + 1;
      const logWeek = getWeekNumber(logDate);
      const currentWeek = getWeekNumber(new Date());
      const currentYear = new Date().getFullYear();

      // Filtres basiques existants
      if (selectedProjectId !== 'all' && log.projectId !== selectedProjectId) {
        return false;
      }

      if (selectedTeamId !== 'all' && !log.personnel?.includes(selectedTeamId)) {
        return false;
      }

      if (selectedMonth !== 'all' && logMonth !== selectedMonth) {
        return false;
      }

      if (logYear !== selectedYear) {
        return false;
      }

      // Time filter
      if (timeFilter === 'today') {
        const today = new Date();
        const isToday = logDate.toDateString() === today.toDateString();
        if (!isToday) return false;
      } else if (timeFilter === 'week') {
        if (logWeek !== currentWeek || logYear !== currentYear) {
          return false;
        }
      }

      // Filtres avancés
      // Recherche textuelle
      if (advancedFilters.searchQuery) {
        const query = advancedFilters.searchQuery.toLowerCase();
        const searchableText = [
          log.notes,
          log.clientName,
          log.address,
          log.tasks,
          ...(log.personnel || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Plage de dates
      if (advancedFilters.dateRange?.from && advancedFilters.dateRange?.to) {
        const logDateParsed = parseISO(log.date);
        if (!isWithinInterval(logDateParsed, {
          start: advancedFilters.dateRange.from,
          end: advancedFilters.dateRange.to
        })) {
          return false;
        }
      }

      // Statut facturation
      if (advancedFilters.invoiceStatus === 'invoiced' && !log.invoiced) {
        return false;
      }
      if (advancedFilters.invoiceStatus === 'pending' && log.invoiced) {
        return false;
      }

      // Statut devis
      if (advancedFilters.quoteStatus === 'signed' && !log.isQuoteSigned) {
        return false;
      }
      if (advancedFilters.quoteStatus === 'unsigned' && log.isQuoteSigned) {
        return false;
      }

      // Plage d'heures
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const totalHours = hours * (log.personnel?.length || 1);
      
      if (advancedFilters.minHours !== null && totalHours < advancedFilters.minHours) {
        return false;
      }
      if (advancedFilters.maxHours !== null && totalHours > advancedFilters.maxHours) {
        return false;
      }

      // Plage de montant
      const amount = totalHours * (log.hourlyRate || 0);
      if (advancedFilters.minAmount !== null && amount < advancedFilters.minAmount) {
        return false;
      }
      if (advancedFilters.maxAmount !== null && amount > advancedFilters.maxAmount) {
        return false;
      }

      // Présence de notes
      if (advancedFilters.hasNotes === 'yes' && (!log.notes || log.notes.trim() === '')) {
        return false;
      }
      if (advancedFilters.hasNotes === 'no' && log.notes && log.notes.trim() !== '') {
        return false;
      }

      // Équipes sélectionnées
      if (advancedFilters.selectedTeams.length > 0) {
        const hasSelectedTeam = log.personnel?.some(person => 
          advancedFilters.selectedTeams.includes(person)
        );
        if (!hasSelectedTeam) {
          return false;
        }
      }

      // Projets sélectionnés
      if (advancedFilters.selectedProjects.length > 0) {
        if (!advancedFilters.selectedProjects.includes(log.projectId)) {
          return false;
        }
      }

      return true;
    });
  }, [
    workLogs, 
    selectedProjectId, 
    selectedTeamId, 
    selectedMonth, 
    selectedYear, 
    timeFilter,
    advancedFilters
  ]);

  return {
    // Filtres basiques
    selectedProjectId,
    setSelectedProjectId,
    selectedTeamId,
    setSelectedTeamId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    timeFilter,
    setTimeFilter,
    
    // Filtres avancés
    advancedFilters,
    setAdvancedFilters,
    
    // Gestion des filtres sauvegardés
    savedFilters,
    saveFilter,
    loadFilter,
    deleteFilter,
    
    // Résultats
    filteredLogs
  };
};