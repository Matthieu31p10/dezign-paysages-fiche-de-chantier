
// Utility to extract information from notes

// Extract client name from notes
export const extractClientName = (notes: string): string | null => {
  if (!notes) return null;
  
  const clientRegex = /client\s*:\s*([^,\n]+)/i;
  const match = notes.match(clientRegex);
  
  return match ? match[1].trim() : null;
};

// Extract address from notes
export const extractAddress = (notes: string): string | null => {
  if (!notes) return null;
  
  const addressRegex = /adresse\s*:\s*([^,\n]+)/i;
  const match = notes.match(addressRegex);
  
  return match ? match[1].trim() : null;
};

// Extract description from notes
export const extractDescription = (notes: string): string | null => {
  if (!notes) return null;
  
  const descRegex = /description\s*:\s*([^,\n]+)/i;
  const match = notes.match(descRegex);
  
  return match ? match[1].trim() : null;
};

// Extract linked project ID from notes
export const extractLinkedProjectId = (notes: string): string | null => {
  if (!notes) return null;
  
  const idRegex = /projet\s*:\s*([a-f0-9-]+)/i;
  const match = notes.match(idRegex);
  
  return match ? match[1].trim() : null;
};

// Extract registration time from notes
export const extractRegistrationTime = (notes: string): string | null => {
  if (!notes) return null;
  
  const timeRegex = /heure\s*:\s*(\d{1,2}[hH]\d{0,2})/i;
  const match = notes.match(timeRegex);
  
  return match ? match[1].trim() : null;
};

// Extract hourly rate from notes
export const extractHourlyRate = (notes: string): number | null => {
  if (!notes) return null;
  
  const rateRegex = /taux\s*horaire\s*:\s*(\d+[\.,]?\d*)/i;
  const match = notes.match(rateRegex);
  
  return match ? parseFloat(match[1].replace(',', '.')) : null;
};

// Extract quote value from notes
export const extractQuoteValue = (notes: string): number | null => {
  if (!notes) return null;
  
  const quoteRegex = /devis\s*:\s*(\d+[\.,]?\d*)/i;
  const match = notes.match(quoteRegex);
  
  return match ? parseFloat(match[1].replace(',', '.')) : null;
};

// Extract signed quote amount from notes
export const extractSignedQuote = (notes: string): number | null => {
  if (!notes) return null;
  
  const signedRegex = /signé\s*:\s*(\d+[\.,]?\d*)/i;
  const match = notes.match(signedRegex);
  
  return match ? parseFloat(match[1].replace(',', '.')) : null;
};

// Extract VAT rate from notes
export const extractVatRate = (notes: string): number | null => {
  if (!notes) return null;
  
  const vatRegex = /tva\s*:\s*(\d+[\.,]?\d*)/i;
  const match = notes.match(vatRegex);
  
  return match ? parseFloat(match[1].replace(',', '.')) : null;
};
