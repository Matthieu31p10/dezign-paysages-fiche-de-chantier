
// Notes Extraction Functions
export const extractClientName = (notes: string): string => {
  const clientMatch = notes.match(/Client\s*:\s*([^\n]+)/i);
  return clientMatch ? clientMatch[1].trim() : '';
};

export const extractAddress = (notes: string): string => {
  const addressMatch = notes.match(/Adresse\s*:\s*([^\n]+)/i);
  return addressMatch ? addressMatch[1].trim() : '';
};

export const extractContactPhone = (notes: string): string => {
  const phoneMatch = notes.match(/Téléphone\s*:\s*([^\n]+)/i);
  return phoneMatch ? phoneMatch[1].trim() : '';
};

export const extractContactEmail = (notes: string): string => {
  const emailMatch = notes.match(/Email\s*:\s*([^\n]+)/i);
  return emailMatch ? emailMatch[1].trim() : '';
};

export const extractDescription = (notes: string): string => {
  // Remove all known fields from notes
  let description = notes;
  
  const fieldsToRemove = [
    /Client\s*:\s*[^\n]+\n?/i,
    /Adresse\s*:\s*[^\n]+\n?/i,
    /Téléphone\s*:\s*[^\n]+\n?/i,
    /Email\s*:\s*[^\n]+\n?/i,
    /ID Projet\s*:\s*[^\n]+\n?/i,
    /Projet Associé\s*:\s*[^\n]+\n?/i,
    /Taux Horaire\s*:\s*[^\n]+\n?/i,
    /TVA\s*:\s*[^\n]+\n?/i,
    /Devis Signé\s*:\s*[^\n]+\n?/i,
    /Valeur Devis\s*:\s*[^\n]+\n?/i
  ];
  
  fieldsToRemove.forEach(field => {
    description = description.replace(field, '');
  });
  
  return description.trim();
};

export const extractLinkedProjectId = (notes: string): string => {
  const projectMatch = notes.match(/ID Projet\s*:\s*([^\n]+)/i) || 
                       notes.match(/Projet Associé\s*:\s*([^\n]+)/i);
  return projectMatch ? projectMatch[1].trim() : '';
};

export const extractHourlyRate = (notes: string): string => {
  const rateMatch = notes.match(/Taux Horaire\s*:\s*([^\n]+)/i);
  return rateMatch ? rateMatch[1].trim() : '';
};

export const extractVatRate = (notes: string): string => {
  const vatMatch = notes.match(/TVA\s*:\s*([^\n]+)/i);
  return vatMatch ? vatMatch[1].trim() : '';
};

export const extractSignedQuote = (notes: string): boolean => {
  const quoteMatch = notes.match(/Devis Signé\s*:\s*([^\n]+)/i);
  if (!quoteMatch) return false;
  
  const value = quoteMatch[1].trim().toLowerCase();
  return value === 'oui' || value === 'true' || value === 'yes';
};

export const extractQuoteValue = (notes: string): number => {
  const valueMatch = notes.match(/Valeur Devis\s*:\s*([^\n]+)/i);
  if (!valueMatch) return 0;
  
  // Try to parse as number
  const valueStr = valueMatch[1].trim().replace(/,/g, '.').replace(/[^\d.]/g, '');
  const value = parseFloat(valueStr);
  return isNaN(value) ? 0 : value;
};

export const extractRegistrationTime = (notes: string): string => {
  const timeMatch = notes.match(/Heure d'enregistrement\s*:\s*([^\n]+)/i);
  return timeMatch ? timeMatch[1].trim() : '';
};
