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

export const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/CLIENT\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

export const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/ADRESSE\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export const extractPhone = (notes: string): string => {
  const phoneMatch = notes.match(/TELEPHONE\s*:\s*([^\n]+)/i);
  return phoneMatch ? phoneMatch[1].trim() : '';
};

export const extractEmail = (notes: string): string => {
  const emailMatch = notes.match(/EMAIL\s*:\s*([^\n]+)/i);
  return emailMatch ? emailMatch[1].trim() : '';
};

export const extractDescription = (notes: string): string => {
  const descMatch = notes.match(/DESCRIPTION DES TRAVAUX:([^]*?)(?=\n\nNOTES ADDITIONNELLES:|\n\nTAUX_TVA:|\n\n|$)/i);
  return descMatch ? descMatch[1].trim() : '';
};

export const extractAdditionalNotes = (notes: string): string => {
  const notesMatch = notes.match(/NOTES ADDITIONNELLES:([^]*?)(?=\n\nTAUX_TVA:|\n\n|$)/i);
  return notesMatch ? notesMatch[1].trim() : '';
};

export const extractVatRate = (notes: string): string => {
  const vatMatch = notes.match(/TAUX_TVA\s*:\s*([^\n]+)/i);
  return vatMatch ? vatMatch[1].trim() : '20';
};

export const extractHourlyRate = (notes: string): number => {
  const rateMatch = notes.match(/TAUX_HORAIRE\s*:\s*([^\n]+)/i);
  return rateMatch ? Number(rateMatch[1].trim()) : 0;
};

export const extractSignedQuote = (notes: string): boolean => {
  const quoteMatch = notes.match(/DEVIS_SIGNE\s*:\s*([^\n]+)/i);
  return quoteMatch ? quoteMatch[1].trim() === 'Oui' : false;
};
