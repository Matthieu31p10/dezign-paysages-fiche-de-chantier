
// Main export file for all storage operations

// Re-export worklog operations
export { 
  loadWorkLogsFromStorage,
  saveWorkLogsToStorage,
  addWorkLogToDatabase,
  updateWorkLogInDatabase
} from './workLogOperations';

// Re-export consumable operations
export { 
  loadSavedConsumables,
  saveConsumableForReuse
} from './consumableOperations';
