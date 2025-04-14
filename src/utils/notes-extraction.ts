
// Functions to extract information from notes

// Extract hourly rate from notes
export const extractHourlyRate = (notes: string): number | null => {
  if (!notes) return null;
  
  const hourlyRateRegex = /taux\s*horaire\s*:?\s*(\d+(?:[.,]\d+)?)/i;
  const match = notes.match(hourlyRateRegex);
  
  if (match && match[1]) {
    // Replace comma with dot for proper parsing
    const rateStr = match[1].replace(',', '.');
    return parseFloat(rateStr);
  }
  
  return null;
};

// Extract VAT rate from notes
export const extractVatRate = (notes: string): '10' | '20' => {
  if (!notes) return '20';
  
  const vatRegex = /tva\s*:?\s*(\d+)%?/i;
  const match = notes.match(vatRegex);
  
  if (match && match[1] === '10') {
    return '10';
  }
  
  return '20';
};

// Extract quote value from notes
export const extractQuoteValue = (notes: string): number | null => {
  if (!notes) return null;
  
  const quoteRegex = /devis\s*:?\s*(\d+(?:[.,]\d+)?)/i;
  const match = notes.match(quoteRegex);
  
  if (match && match[1]) {
    // Replace comma with dot for proper parsing
    const valueStr = match[1].replace(',', '.');
    return parseFloat(valueStr);
  }
  
  return null;
};

// Extract client name from notes
export const extractClientName = (notes: string): string => {
  const match = notes.match(/CLIENT: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
};

// Extract address from notes
export const extractAddress = (notes: string): string => {
  const match = notes.match(/ADRESSE: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
};

// Extract description of works from notes
export const extractDescription = (notes: string): string => {
  const match = notes.match(/DESCRIPTION: ([\s\S]*?)(?=\n\w+:|$)/);
  return match ? match[1].trim() : '';
};

// Extract if a quote has been signed
export const extractSignedQuote = (notes: string): boolean => {
  const match = notes.match(/SIGNED_QUOTE: (true|false)(?:\n|$)/);
  return match ? match[1] === 'true' : false;
};

// Extract linked project ID
export const extractLinkedProjectId = (notes: string): string => {
  const match = notes.match(/PROJECT_ID: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
};

// Extract registration time from notes
export const extractRegistrationTime = (notes: string): string | null => {
  const match = notes.match(/REGISTRATION_TIME: ([^\n]+)/);
  return match ? match[1] : null;
};
