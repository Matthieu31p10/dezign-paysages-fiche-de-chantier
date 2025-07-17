import React from 'react';
import ProjectDocuments from '../ProjectDocuments';

interface ProjectDocumentsTabProps {
  project: {
    id: string;
    name: string;
  };
}

const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <ProjectDocuments projectId={project.id} />
    </div>
  );
};

export default ProjectDocumentsTab;