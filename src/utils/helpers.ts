
/**
 * Utility functions for extracting data from structured notes
 */

// Extract client name from structured notes
export const extractClientName = (notes: string): string => {
  const match = notes.match(/CLIENT: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Extract address from structured notes
export const extractAddress = (notes: string): string => {
  const match = notes.match(/ADRESSE: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Extract contact phone from structured notes
export const extractContactPhone = (notes: string): string => {
  const match = notes.match(/TÉLÉPHONE: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Extract contact email from structured notes
export const extractContactEmail = (notes: string): string => {
  const match = notes.match(/EMAIL: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Extract linked project ID from structured notes
export const extractLinkedProjectId = (notes: string): string => {
  const match = notes.match(/ID PROJET: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Extract hourly rate from structured notes
export const extractHourlyRate = (notes: string): string => {
  const match = notes.match(/TAUX HORAIRE: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '0';
};

// Extract VAT rate from structured notes
export const extractVatRate = (notes: string): string => {
  const match = notes.match(/TVA: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '20';
};

// Extract signed quote info from structured notes
export const extractSignedQuote = (notes: string): boolean => {
  const match = notes.match(/DEVIS SIGNÉ: (.+)(\r|\n|$)/);
  return match ? match[1].trim().toLowerCase() === 'oui' : false;
};

// Extract quote value from structured notes
export const extractQuoteValue = (notes: string): string => {
  const match = notes.match(/VALEUR DEVIS: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '0';
};

// Extract description from structured notes
export const extractDescription = (notes: string): string => {
  const match = notes.match(/DESCRIPTION: (.+)(\r|\n|$)/);
  return match ? match[1].trim() : '';
};

// Format date as string
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Format hours
export const formatHours = (hours: number): string => {
  return `${hours.toFixed(2)}h`;
};
