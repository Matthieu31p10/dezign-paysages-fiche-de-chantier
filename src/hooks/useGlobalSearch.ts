import { useState, useMemo, useCallback } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { extractClientName, extractAddress } from '@/utils/notes-extraction';
import { formatDate } from '@/utils/helpers';

export interface SearchResult {
  id: string;
  type: 'project' | 'worklog' | 'blank-sheet';
  title: string;
  subtitle: string;
  description: string;
  data: any;
  score: number;
}

interface UseGlobalSearchProps {
  projects: ProjectInfo[];
  workLogs: WorkLog[];
  teams: { id: string; name: string }[];
}

export const useGlobalSearch = ({ projects, workLogs, teams }: UseGlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'project' | 'worklog' | 'blank-sheet'>('all');

  // Calculate search score based on relevance
  const calculateScore = useCallback((text: string, searchTerms: string[]): number => {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    searchTerms.forEach(term => {
      if (lowerText.includes(term)) {
        // Exact match gets higher score
        if (lowerText === term) score += 100;
        // Word start match gets medium score
        else if (lowerText.startsWith(term)) score += 50;
        // Contains match gets lower score
        else score += 20;
      }
    });
    
    return score;
  }, []);

  // Search through projects
  const searchProjects = useCallback((searchTerms: string[]): SearchResult[] => {
    return projects
      .filter(project => !project.isArchived)
      .map(project => {
        const team = teams.find(t => t.id === project.team);
        const searchableText = [
          project.name,
          project.clientName || '',
          project.address,
          project.projectType || '',
          team?.name || '',
          project.contact?.name || '',
          project.contact?.email || ''
        ].join(' ').toLowerCase();

        const score = calculateScore(searchableText, searchTerms);
        
        return {
          id: project.id,
          type: 'project' as const,
          title: project.name,
          subtitle: project.clientName || 'Client non spécifié',
          description: `${project.address} • ${team?.name || 'Équipe non assignée'}`,
          data: project,
          score
        };
      })
      .filter(result => result.score > 0);
  }, [projects, teams, calculateScore]);

  // Search through work logs
  const searchWorkLogs = useCallback((searchTerms: string[]): SearchResult[] => {
    return workLogs
      .filter(log => !log.projectId?.startsWith('blank-') && !log.projectId?.startsWith('DZFV'))
      .map(log => {
        const project = projects.find(p => p.id === log.projectId);
        const searchableText = [
          project?.name || '',
          project?.clientName || '',
          log.notes || '',
          log.personnel?.join(' ') || '',
          formatDate(log.date),
          log.tasks || ''
        ].join(' ').toLowerCase();

        const score = calculateScore(searchableText, searchTerms);
        
        return {
          id: log.id,
          type: 'worklog' as const,
          title: project?.name || 'Projet inconnu',
          subtitle: formatDate(log.date),
          description: `${log.timeTracking?.totalHours || 0}h • ${log.personnel?.join(', ') || 'Personnel non spécifié'}`,
          data: log,
          score
        };
      })
      .filter(result => result.score > 0);
  }, [workLogs, projects, calculateScore]);

  // Search through blank sheets
  const searchBlankSheets = useCallback((searchTerms: string[]): SearchResult[] => {
    return workLogs
      .filter(log => log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV')))
      .map(log => {
        const clientName = extractClientName(log.notes || '');
        const address = extractAddress(log.notes || '');
        const searchableText = [
          clientName,
          address,
          log.notes || '',
          log.personnel?.join(' ') || '',
          formatDate(log.date),
          log.tasks || ''
        ].join(' ').toLowerCase();

        const score = calculateScore(searchableText, searchTerms);
        
        return {
          id: log.id,
          type: 'blank-sheet' as const,
          title: clientName || 'Client non spécifié',
          subtitle: formatDate(log.date),
          description: `${address} • ${log.timeTracking?.totalHours || 0}h`,
          data: log,
          score
        };
      })
      .filter(result => result.score > 0);
  }, [workLogs, calculateScore]);

  // Combined search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let results: SearchResult[] = [];

    if (selectedType === 'all' || selectedType === 'project') {
      results = [...results, ...searchProjects(searchTerms)];
    }
    
    if (selectedType === 'all' || selectedType === 'worklog') {
      results = [...results, ...searchWorkLogs(searchTerms)];
    }
    
    if (selectedType === 'all' || selectedType === 'blank-sheet') {
      results = [...results, ...searchBlankSheets(searchTerms)];
    }

    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [query, selectedType, searchProjects, searchWorkLogs, searchBlankSheets]);

  // Quick stats for search
  const searchStats = useMemo(() => {
    const stats = {
      total: searchResults.length,
      projects: searchResults.filter(r => r.type === 'project').length,
      workLogs: searchResults.filter(r => r.type === 'worklog').length,
      blankSheets: searchResults.filter(r => r.type === 'blank-sheet').length
    };
    return stats;
  }, [searchResults]);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    openSearch,
    closeSearch,
    selectedType,
    setSelectedType,
    searchResults,
    searchStats,
    hasResults: searchResults.length > 0
  };
};