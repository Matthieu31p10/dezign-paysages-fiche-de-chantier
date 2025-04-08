
// Fonction pour extraire le nom du client des notes
export function extractClientName(notes: string): string {
  const match = notes.match(/CLIENT: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire l'adresse des notes
export function extractAddress(notes: string): string {
  const match = notes.match(/ADRESSE: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire le numéro de téléphone de contact
export function extractContactPhone(notes: string): string {
  const match = notes.match(/PHONE: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire l'email de contact
export function extractContactEmail(notes: string): string {
  const match = notes.match(/EMAIL: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire la description des travaux des notes
export function extractDescription(notes: string): string {
  const match = notes.match(/DESCRIPTION: ([\s\S]*?)(?=\n\w+:|$)/);
  return match ? match[1].trim() : '';
}

// Fonction pour extraire le taux horaire
export function extractHourlyRate(notes: string): number {
  const match = notes.match(/HOURLY_RATE: ([\d.]+)(?:\n|$)/);
  return match ? parseFloat(match[1]) : 0;
}

// Fonction pour extraire le taux de TVA
export function extractVatRate(notes: string): "10" | "20" {
  const match = notes.match(/VAT_RATE: (10|20)(?:\n|$)/);
  return match ? (match[1] as "10" | "20") : "20";
}

// Fonction pour extraire si un devis a été signé
export function extractSignedQuote(notes: string): boolean {
  const match = notes.match(/SIGNED_QUOTE: (true|false)(?:\n|$)/);
  return match ? match[1] === 'true' : false;
}

// Fonction pour extraire la valeur du devis HT
export function extractQuoteValue(notes: string): number {
  const match = notes.match(/QUOTE_VALUE: ([\d.]+)(?:\n|$)/);
  return match ? parseFloat(match[1]) : 0;
}

// Fonction pour extraire l'ID du projet lié
export function extractLinkedProjectId(notes: string): string {
  const match = notes.match(/PROJECT_ID: (.*?)(?:\n|$)/);
  return match ? match[1] : '';
}

// Fonction pour extraire le temps d'enregistrement des notes
export const extractRegistrationTime = (notes: string): string | null => {
  const match = notes.match(/REGISTRATION_TIME: ([^\n]+)/);
  return match ? match[1] : null;
}

// Formatter les notes des consommables pour le stockage
export function formatConsumableNotes(consumables: any[]): string {
  if (!consumables || consumables.length === 0) return '';
  
  return consumables.map((item, index) => {
    return `CONSUMABLE_${index + 1}: ${item.supplier || ''},${item.product || ''},${item.unit || ''},${item.quantity},${item.unitPrice},${item.totalPrice}`; 
  }).join('\n');
}
