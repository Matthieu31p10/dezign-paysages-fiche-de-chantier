
// This file re-exports all storage-related functions to maintain the original API
export { loadWorkLogsFromStorage, deleteWorkLogFromStorage } from './storage/workLogOperations';
export { saveWorkLogsToStorage } from './storage/saveWorkLogs';
export { loadSavedConsumables, saveConsumableForReuse } from './storage/consumableOperations';
