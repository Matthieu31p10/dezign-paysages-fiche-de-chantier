
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// Clés de stockage local utilisées dans l'application
const STORAGE_KEYS = [
  'landscaping-projects',
  'landscaping-worklogs',
  'landscaping-teams',
  'landscaping-settings',
  'landscaping-auth'
];

/**
 * Crée une sauvegarde ZIP de toutes les données de l'application
 */
export const createBackupZip = async (): Promise<void> => {
  try {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = zip.folder(`landscaping-backup-${timestamp}`);
    
    if (!backupFolder) {
      throw new Error("Impossible de créer le dossier de sauvegarde");
    }
    
    // Ajouter chaque élément de localStorage au ZIP
    let hasData = false;
    
    for (const key of STORAGE_KEYS) {
      const data = localStorage.getItem(key);
      if (data) {
        hasData = true;
        // Formatter le JSON pour une meilleure lisibilité
        const formattedData = JSON.stringify(JSON.parse(data), null, 2);
        backupFolder.file(`${key}.json`, formattedData);
      }
    }
    
    if (!hasData) {
      toast.warning("Aucune donnée à sauvegarder trouvée");
      return;
    }
    
    // Ajouter un fichier README
    backupFolder.file('README.txt', 
      `Sauvegarde de l'application Landscaping\n` +
      `Date: ${new Date().toLocaleString('fr-FR')}\n\n` +
      `Pour restaurer cette sauvegarde, utilisez la fonction "Importer une sauvegarde" dans les paramètres de l'application.`
    );
    
    // Générer le ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Télécharger le fichier
    saveAs(content, `landscaping-backup-${timestamp}.zip`);
    
    toast.success("Sauvegarde créée avec succès");
  } catch (error) {
    console.error("Erreur lors de la création de la sauvegarde:", error);
    toast.error("Erreur lors de la création de la sauvegarde");
  }
};

/**
 * Restaure les données depuis un fichier ZIP
 */
export const restoreFromZip = async (file: File): Promise<boolean> => {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    // Vérifier si c'est un fichier de sauvegarde valide
    const isValid = Object.keys(zipContent.files).some(path => 
      STORAGE_KEYS.some(key => path.includes(`${key}.json`))
    );
    
    if (!isValid) {
      toast.error("Le fichier ZIP ne semble pas être une sauvegarde valide");
      return false;
    }
    
    // Restaurer chaque fichier dans localStorage
    let restoredCount = 0;
    
    // Trouver le dossier racine (au cas où)
    const rootFolder = Object.keys(zipContent.files)
      .filter(path => zipContent.files[path].dir)
      .sort((a, b) => a.length - b.length)[0] || '';
    
    const promises = STORAGE_KEYS.map(async (key) => {
      // Chercher le fichier dans le zip (avec ou sans dossier parent)
      const fileName = `${key}.json`;
      const filePath = rootFolder ? `${rootFolder}${fileName}` : fileName;
      const filePathWithSlash = rootFolder && !rootFolder.endsWith('/') ? `${rootFolder}/${fileName}` : filePath;
      
      const file = zipContent.files[filePath] || zipContent.files[filePathWithSlash];
      
      if (file && !file.dir) {
        try {
          const content = await file.async('string');
          localStorage.setItem(key, content);
          restoredCount++;
        } catch (error) {
          console.error(`Erreur lors de la restauration de ${key}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
    
    if (restoredCount === 0) {
      toast.error("Aucune donnée n'a pu être restaurée");
      return false;
    }
    
    toast.success(`Restauration réussie: ${restoredCount} éléments restaurés`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la restauration de la sauvegarde:", error);
    toast.error("Erreur lors de la restauration de la sauvegarde");
    return false;
  }
};
