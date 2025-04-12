
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface BackupData {
  projects?: unknown;
  workLogs?: unknown;
  settings?: unknown;
  teams?: unknown;
  users?: unknown;
}

/**
 * Creates a backup of all application data
 */
export const backupData = async (): Promise<void> => {
  // Create a new zip archive
  const zip = new JSZip();
  
  // Get all data from localStorage
  const allData: BackupData = {};
  
  // Add projects data if available
  const projectsData = localStorage.getItem('projects');
  if (projectsData) {
    allData.projects = JSON.parse(projectsData);
  }
  
  // Add workLogs data if available
  const workLogsData = localStorage.getItem('workLogs');
  if (workLogsData) {
    allData.workLogs = JSON.parse(workLogsData);
  }
  
  // Add settings data if available
  const settingsData = localStorage.getItem('settings');
  if (settingsData) {
    allData.settings = JSON.parse(settingsData);
  }
  
  // Add teams data if available
  const teamsData = localStorage.getItem('teams');
  if (teamsData) {
    allData.teams = JSON.parse(teamsData);
  }
  
  // Add users data if available
  const usersData = localStorage.getItem('users');
  if (usersData) {
    allData.users = JSON.parse(usersData);
  }
  
  // Create a JSON file with all data
  zip.file('data.json', JSON.stringify(allData, null, 2));
  
  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Create a timestamp for the filename
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  
  // Save the zip file
  saveAs(content, `backup-${formattedDate}.zip`);
};

/**
 * Restores data from a backup file
 */
export const restoreData = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if file is a zip file
    if (!file.name.endsWith('.zip')) {
      reject(new Error('Le fichier doit être au format ZIP'));
      return;
    }
    
    // Read the file
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target || !event.target.result) {
          reject(new Error('Erreur lors de la lecture du fichier'));
          return;
        }
        
        // Load the zip file
        const zip = new JSZip();
        const content = await zip.loadAsync(event.target.result);
        
        // Extract the data.json file
        const dataFile = content.files['data.json'];
        
        if (!dataFile) {
          reject(new Error('Fichier de sauvegarde invalide'));
          return;
        }
        
        // Parse the JSON data
        const jsonContent = await dataFile.async('text');
        const data: BackupData = JSON.parse(jsonContent);
        
        // Restore data to localStorage
        if (data.projects) {
          localStorage.setItem('projects', JSON.stringify(data.projects));
        }
        
        if (data.workLogs) {
          localStorage.setItem('workLogs', JSON.stringify(data.workLogs));
        }
        
        if (data.settings) {
          localStorage.setItem('settings', JSON.stringify(data.settings));
        }
        
        if (data.teams) {
          localStorage.setItem('teams', JSON.stringify(data.teams));
        }
        
        if (data.users) {
          localStorage.setItem('users', JSON.stringify(data.users));
        }
        
        resolve();
      } catch (error) {
        console.error('Restore error:', error);
        reject(new Error('Erreur lors de la restauration des données'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
