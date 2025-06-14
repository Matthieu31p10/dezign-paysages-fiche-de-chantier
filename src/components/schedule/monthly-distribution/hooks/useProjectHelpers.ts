
export const useProjectHelpers = (projects: any[], teams: any[]) => {
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Chantier inconnu";
  };
  
  const getProjectTeam = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Équipe inconnue";
    
    const team = teams.find(t => t.id === project.team);
    return team ? team.name : "Équipe non assignée";
  };

  return {
    getProjectName,
    getProjectTeam
  };
};
