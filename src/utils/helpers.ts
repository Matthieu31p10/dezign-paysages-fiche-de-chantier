// This file is kept for backward compatibility
// It re-exports all utilities from their new locations
export * from './date';
export * from './time';
export * from './format';
export * from './projects';
export * from './statistics';

/**
 * Extract linked project ID from notes
 * @param notes Notes text
 * @returns Project ID or null if not found
 */
export const extractLinkedProjectId = (notes: string): string | null => {
  const projectMatch = notes.match(/PROJET_LIE\s*:\s*([^\n]+)/i);
  return projectMatch ? projectMatch[1].trim() : null;
};
