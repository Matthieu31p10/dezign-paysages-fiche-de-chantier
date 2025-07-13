// Note extraction utilities for parsing work log notes

export const extractClientName = (notes: string): string => {
  if (!notes) return '';
  
  const clientMatch = notes.match(/client[\s:]*([^\n\r.;,]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

export const extractAddress = (notes: string): string => {
  if (!notes) return '';
  
  const addressMatch = notes.match(/adresse[\s:]*([^\n\r.;]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export const extractDescription = (notes: string): string => {
  if (!notes) return '';
  
  // Extract everything that doesn't look like structured data
  const lines = notes.split('\n').filter(line => {
    const lower = line.toLowerCase().trim();
    return !lower.startsWith('client:') &&
           !lower.startsWith('adresse:') &&
           !lower.startsWith('projet:') &&
           !lower.startsWith('taux:') &&
           !lower.startsWith('devis:');
  });
  
  return lines.join('\n').trim();
};

export const extractLinkedProjectId = (notes: string): string => {
  if (!notes) return '';
  
  const projectMatch = notes.match(/projet[\s:]*([a-zA-Z0-9-]+)/i);
  return projectMatch ? projectMatch[1].trim() : '';
};

export const extractRegistrationTime = (notes: string): string => {
  if (!notes) return '';
  
  const timeMatch = notes.match(/enregistr[eé][\s:]*([0-9]{1,2}[h:][0-9]{1,2})/i);
  return timeMatch ? timeMatch[1].trim() : '';
};

export const extractHourlyRate = (notes: string): number => {
  if (!notes) return 0;
  
  const rateMatch = notes.match(/taux[\s:]*([0-9,\.]+)/i);
  if (rateMatch) {
    return parseFloat(rateMatch[1].replace(',', '.')) || 0;
  }
  
  return 0;
};

export const extractQuoteValue = (notes: string): number => {
  if (!notes) return 0;
  
  const quoteMatch = notes.match(/devis[\s:]*([0-9,\.]+)/i);
  if (quoteMatch) {
    return parseFloat(quoteMatch[1].replace(',', '.')) || 0;
  }
  
  return 0;
};

export const extractSignedQuote = (notes: string): boolean => {
  if (!notes) return false;
  
  const signedMatch = notes.match(/devis[\s:]*sign[eé]/i);
  return !!signedMatch;
};

export const extractVatRate = (notes: string): number => {
  if (!notes) return 20; // Default VAT rate
  
  const vatMatch = notes.match(/tva[\s:]*([0-9,\.]+)/i);
  if (vatMatch) {
    return parseFloat(vatMatch[1].replace(',', '.')) || 20;
  }
  
  return 20;
};