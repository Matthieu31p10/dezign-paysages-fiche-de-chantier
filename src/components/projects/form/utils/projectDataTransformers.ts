
import { ProjectInfo } from '@/types/models';

/**
 * Helper function to safely convert to a ProjectInfo object
 */
export const convertToProjectInfo = (data: any): Partial<ProjectInfo> => {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name,
    address: data.address,
    contact: data.contact,
    contract: data.contract,
    irrigation: data.irrigation,
    mowerType: data.mowerType,
    annualVisits: data.annualVisits,
    annualTotalHours: data.annualTotalHours,
    visitDuration: data.visitDuration,
    additionalInfo: data.additionalInfo,
    teams: data.teams || [],
    team: data.team,
    projectType: data.projectType,
    startDate: data.startDate,
    endDate: data.endDate,
    isArchived: data.isArchived,
    createdAt: data.createdAt || new Date(),
  };
};
