
/**
 * Formate la taille des fichiers en unités lisibles
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formate une date au format JJ/MM/AAAA
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Formate le code de gestion des déchets en texte lisible
 */
export const formatWasteManagement = (wasteCode?: string): string => {
  if (!wasteCode || wasteCode === 'none') return 'Aucun';
  
  const parts = wasteCode.split('_');
  const type = parts[0];
  const quantity = parts.length > 1 ? parts[1] : '1';
  
  switch (type) {
    case 'big_bag': return `${quantity} Big-bag${quantity !== '1' ? 's' : ''}`;
    case 'half_dumpster': return `${quantity} × ½ Benne${quantity !== '1' ? 's' : ''}`;
    case 'dumpster': return `${quantity} Benne${quantity !== '1' ? 's' : ''}`;
    case 'small_container': return `${quantity} Petit container${quantity !== '1' ? 's' : ''}`;
    case 'large_container': return `${quantity} Grand container${quantity !== '1' ? 's' : ''}`;
    default: return wasteCode; // Fallback pour les anciens formats
  }
};
