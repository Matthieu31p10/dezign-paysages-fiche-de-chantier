// Search utilities for text processing and ranking

export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWords?: boolean;
  fuzzyMatch?: boolean;
  maxResults?: number;
}

// Normalize text for search
export const normalizeText = (text: string, caseSensitive = false): string => {
  let normalized = text.trim();
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  // Remove diacritics and special characters
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized;
};

// Split query into search terms
export const parseSearchQuery = (query: string): string[] => {
  return query
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => normalizeText(term));
};

// Calculate text similarity score
export const calculateSimilarity = (text: string, searchTerm: string, options: SearchOptions = {}): number => {
  const normalizedText = normalizeText(text, options.caseSensitive);
  const normalizedTerm = normalizeText(searchTerm, options.caseSensitive);

  if (normalizedText === normalizedTerm) return 100;
  if (normalizedText.includes(normalizedTerm)) return 80;
  
  if (options.fuzzyMatch) {
    return calculateLevenshteinScore(normalizedText, normalizedTerm);
  }
  
  return 0;
};

// Levenshtein distance for fuzzy matching
const calculateLevenshteinScore = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return Math.max(0, ((maxLength - distance) / maxLength) * 100);
};

// Highlight search terms in text
export const highlightSearchTerms = (text: string, searchTerms: string[]): string => {
  if (!searchTerms.length) return text;

  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
};

// Escape special regex characters
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Extract search context around matches
export const extractContext = (text: string, searchTerm: string, contextLength = 50): string => {
  const normalizedText = normalizeText(text);
  const normalizedTerm = normalizeText(searchTerm);
  
  const index = normalizedText.indexOf(normalizedTerm);
  if (index === -1) return text.substring(0, contextLength * 2) + '...';

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + normalizedTerm.length + contextLength);
  
  let context = text.substring(start, end);
  
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  return context;
};

// Create searchable index for better performance
export const createSearchIndex = (items: any[], fields: string[]): Map<string, any[]> => {
  const index = new Map<string, any[]>();

  items.forEach(item => {
    fields.forEach(field => {
      const value = item[field];
      if (value) {
        const terms = parseSearchQuery(value.toString());
        terms.forEach(term => {
          if (!index.has(term)) {
            index.set(term, []);
          }
          index.get(term)!.push(item);
        });
      }
    });
  });

  return index;
};

// Search using pre-built index
export const searchWithIndex = (
  index: Map<string, any[]>, 
  query: string, 
  options: SearchOptions = {}
): any[] => {
  const searchTerms = parseSearchQuery(query);
  if (!searchTerms.length) return [];

  let results: any[] = [];
  
  searchTerms.forEach(term => {
    const matches = index.get(term) || [];
    results = results.length === 0 ? matches : results.filter(item => matches.includes(item));
  });

  if (options.maxResults) {
    results = results.slice(0, options.maxResults);
  }

  return results;
};

// Advanced search with ranking
export const advancedSearch = (
  items: any[],
  query: string,
  fields: string[],
  options: SearchOptions = {}
): Array<{ item: any; score: number }> => {
  const searchTerms = parseSearchQuery(query);
  if (!searchTerms.length) return [];

  const results = items.map(item => {
    let totalScore = 0;
    let matchCount = 0;

    fields.forEach(field => {
      const value = item[field];
      if (value) {
        searchTerms.forEach(term => {
          const score = calculateSimilarity(value.toString(), term, options);
          if (score > 0) {
            totalScore += score;
            matchCount++;
          }
        });
      }
    });

    // Average score weighted by match count
    const finalScore = matchCount > 0 ? (totalScore / matchCount) * (matchCount / searchTerms.length) : 0;

    return { item, score: finalScore };
  });

  return results
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, options.maxResults || 50);
};