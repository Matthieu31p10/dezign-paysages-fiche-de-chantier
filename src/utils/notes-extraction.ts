
// Functions to extract information from notes

// Extract hourly rate from notes
export const extractHourlyRate = (notes: string): number | string | null => {
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
export const extractQuoteValue = (notes: string): number | string | null => {
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
