
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
 * Formate le code de gestion des déchets en texte lisible avec descriptions améliorées
 */
export const formatWasteManagement = (wasteCode?: string): string => {
  if (!wasteCode || wasteCode === 'none') return 'Aucun';
  
  const parts = wasteCode.split('_');
  const type = parts[0];
  const quantity = parts.length > 1 ? parts[1] : '1';
  
  // Fonction pour pluraliser correctement
  const pluralize = (singular: string, count: string): string => {
    return parseInt(count) > 1 ? `${singular}s` : singular;
  };
  
  switch (type) {
    case 'big_bag': 
      return `${quantity} Big-bag${parseInt(quantity) > 1 ? 's' : ''}`;
    
    case 'half_dumpster': 
      return `${quantity} × ½ Benne${parseInt(quantity) > 1 ? 's' : ''}`;
    
    case 'dumpster': 
      return `${quantity} Benne${parseInt(quantity) > 1 ? 's' : ''}`;
    
    case 'small_container': 
      return `${quantity} Petit${pluralize(' container', quantity)}`;
    
    case 'large_container': 
      return `${quantity} Grand${pluralize(' container', quantity)}`;
    
    // Support pour les anciens formats
    case 'keep': return 'Déchets conservés';
    case 'remove': return 'Déchets évacués';
    
    default: 
      // Essayer de gérer d'autres formats possibles
      if (type.includes('bag')) return `${quantity} Sac${parseInt(quantity) > 1 ? 's' : ''}`;
      if (type.includes('container')) return `${quantity} Container${parseInt(quantity) > 1 ? 's' : ''}`;
      if (type.includes('dumpster')) return `${quantity} Benne${parseInt(quantity) > 1 ? 's' : ''}`;
      
      return wasteCode; // Fallback pour les formats inconnus
  }
};
