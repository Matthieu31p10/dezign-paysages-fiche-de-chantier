
// Extract client name from notes
export const extractClientName = (notes: string): string => {
  const match = notes.match(/CLIENT:\s*(.+)/);
  return match ? match[1].trim() : '';
};

// Extract address from notes
export const extractAddress = (notes: string): string => {
  const match = notes.match(/ADRESSE:\s*(.+)/);
  return match ? match[1].trim() : '';
};

// Extract description from notes
export const extractDescription = (notes: string): string => {
  const match = notes.match(/DESCRIPTION:\s*(.+)/);
  return match ? match[1].trim() : '';
};

// Extract linked project ID from notes
export const extractLinkedProjectId = (notes: string): string | null => {
  const match = notes.match(/ID PROJET:\s*(.+)/);
  return match && match[1].trim() !== '' ? match[1].trim() : null;
};

// Extract hourly rate from notes
export const extractHourlyRate = (notes: string): number | null => {
  const match = notes.match(/TAUX HORAIRE:\s*(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
};

// Extract signed quote status from notes
export const extractSignedQuote = (notes: string): boolean => {
  const match = notes.match(/DEVIS SIGNÉ:\s*(\w+)/);
  return match ? match[1].toLowerCase() === 'oui' : false;
};

// Extract quote value from notes
export const extractQuoteValue = (notes: string): number | null => {
  const match = notes.match(/VALEUR DEVIS:\s*(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
};
