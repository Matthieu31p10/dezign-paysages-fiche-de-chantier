
import { useProjectLocksData } from './useProjectLocksData';
import { useProjectLocksOperations } from './useProjectLocksOperations';
import { useProjectLocksQueries } from './useProjectLocksQueries';

export const useProjectLocks = () => {
  const { projectLocks, setProjectLocks, isLoading, refreshLocks } = useProjectLocksData();
  const operations = useProjectLocksOperations(setProjectLocks);
  const queries = useProjectLocksQueries(projectLocks);

  return {
    projectLocks,
    isLoading,
    refreshLocks,
    addProjectLock: operations.addProjectLock,
    removeProjectLock: (lockId: string) => operations.removeProjectLock(lockId, projectLocks),
    toggleProjectLock: (lockId: string) => operations.toggleProjectLock(lockId, projectLocks),
    ...queries,
  };
};
